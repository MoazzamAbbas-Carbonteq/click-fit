$(document).ready(function() {

  setTimeout(function() {
    $('#preloader').fadeOut('slow', function() {
      $(this).remove();
    });
  }, 1000);

  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

  $.getJSON('http://numbersapi.com/1/30/date?json')
    .done(function(data) {
      $('#daily-fact').html(`
        <p class="mb-0"><i class="fas fa-lightbulb text-warning me-2"></i> ${data.text}</p>
        <small class="text-muted mt-2 d-block">Source: Numbers API</small>
      `);
    })
    .fail(function() {
      $('#daily-fact').html(`
        <p class="mb-0">Did you know regular exercise can improve your mood and reduce feelings of anxiety and depression?</p>
        <small class="text-muted mt-2 d-block">Source: Click Fit</small>
      `);
    });

  
  const uploadArea = $('#upload-area');
  const fileInput = $('#file-input');
  const previewContainer = $('#upload-preview-container');
  const previewElement = $('#upload-preview');
  const uploadButton = $('#upload-button');
  const uploadSuccess = $('#upload-success');
  const uploadedImageContainer = $('#uploaded-image-container');
  const browseButton = $('#browse-button');

  let selectedFile = null;

  browseButton.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    fileInput.click();
  });

  uploadArea.on('dragover', function(e) {
    e.preventDefault();
    uploadArea.addClass('dragover');
  });

  uploadArea.on('dragleave', function() {
    uploadArea.removeClass('dragover');
  });

  uploadArea.on('drop', function(e) {
    e.preventDefault();
    uploadArea.removeClass('dragover');
    
    if (e.originalEvent.dataTransfer.files.length) {
      handleFiles(e.originalEvent.dataTransfer.files);
    }
  });

  fileInput.on('change', function() {
    console.log('File input changed:', this.files);
    if (this.files.length) {
      handleFiles(this.files);
    }
  });

  $(document).on('click', '#clear-preview', function() {
    clearPreview();
  });

  function clearPreview() {
    previewElement.html('');
    previewContainer.addClass('d-none');
    fileInput.val('');
    selectedFile = null;
  }

  function handleFiles(files) {
    console.log('Handling files:', files);
    const file = files[0];
    
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    selectedFile = file;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      console.log('File loaded:', e.target.result.substring(0, 50) + '...');
      previewElement.html(`<img src="${e.target.result}" alt="Preview">`);
      previewContainer.removeClass('d-none');
      uploadSuccess.addClass('d-none');
    };
    
    reader.readAsDataURL(file);
  }

  uploadButton.on('click', function() {
    console.log('Upload button clicked');
    console.log('Selected file:', selectedFile);
    
    if (!selectedFile) {
      alert('Please select an image to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    console.log('Sending AJAX request to /upload');
    
    $.ajax({
      url: 'http://localhost:3000/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function() {
        console.log('Request starting...');
        uploadButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...');
      },
      success: function(response) {
        console.log('Upload successful:', response);
        uploadButton.prop('disabled', false).html('Upload Image');
        previewContainer.addClass('d-none');
        uploadSuccess.removeClass('d-none');

        uploadedImageContainer.html(`
          <div class="card mb-4">
            <img src="http://localhost:3000${response.path}" class="card-img-top" alt="Uploaded Image"> 
            <div class="card-body">
              <h5 class="card-title">Upload Successful!</h5>
              <p class="card-text">Your image has been uploaded successfully.</p>
            </div>
          </div>
        `).removeClass('d-none');
        
        fileInput.val('');
        selectedFile = null;
      },
      error: function(xhr, status, error) {
        console.error('Upload failed:', status, error);
        console.error('Response:', xhr.responseText);
        uploadButton.prop('disabled', false).html('Upload Image');
        alert('Error uploading image: ' + error);
      }
    });
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('[data-toggle="popover"]').popover();

  $('a.smooth-scroll').on('click', function(e) {
    e.preventDefault();
    const target = $(this.hash);
    $('html, body').animate({
      scrollTop: target.offset().top - 70
    }, 800);
  });

  const registerButton = $('#registerButton');
  const registerForm = $('#registerForm');
  const registerError = $('#registerError');
  const registerSuccess = $('#registerSuccess');
  const registerModal = $('#registerModal');

  registerButton.on('click', function() {

    registerError.addClass('d-none');
    registerSuccess.addClass('d-none');

    const email = $('#email').val();
    const password = $('#password').val();
    const userType = $('#userType').val();

    if (!email || !password || !userType) {
      registerError.removeClass('d-none').text('Please fill in all fields');
      return;
    }

    registerButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...');

    $.ajax({
      url: 'http://localhost:3000/api/users',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        email: email,
        password: password,
        type: userType
      }),
      success: function(response) {

        registerSuccess.removeClass('d-none').text('Registration successful! Welcome to Click Fit.');
        
        registerForm[0].reset();
        
        setTimeout(function() {
          registerModal.modal('hide');
          registerButton.prop('disabled', false).text('Register');
        }, 2000);
      },
      error: function(xhr) {
        const errorMessage = xhr.responseJSON?.error || 'Registration failed. Please try again.';
        registerError.removeClass('d-none').text(errorMessage);
        registerButton.prop('disabled', false).text('Register');
      }
    });
  });

  registerModal.on('hidden.bs.modal', function() {
    registerForm[0].reset();
    registerError.addClass('d-none');
    registerSuccess.addClass('d-none');
    registerButton.prop('disabled', false).text('Register');
  });
});
