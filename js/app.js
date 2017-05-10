 var config = {
   host: 'http://localhost:3333/'
 };

 //eventos
 $(document).ready(function () {
   thPost()
   getPostAjax()
 })
 //Ajax delete comentários
 $(document).on('click', '.delete_comment', function (e) {
   e.preventDefault()
   var comment_id = $(this).data('comment_id')
   var del = confirm("Deseja deletar o comentario_id: " + comment_id)
   if (del) {
     var promise = $.ajax({
       method: 'delete',
       url: config.host + 'comment/' + comment_id,
       headers: {
         Authorization: 'Bearer ' + getToken()
       }
     })
     promise.done(function (response) {
       alert('Deletado com sucesso')
       getPostAjax()
     })

     promise.fail(function (response) {
       alert('Erro ao deletar')
     })
   }
 })
 //Ajax delete posts
 $(document).on('click', '.delete_post', function (e) {
   e.preventDefault()
   var post_id = $(this).data('post_id')
   var del = confirm("Deseja deletar o post_id: " + post_id)
   if (del) {
     var promise = $.ajax({
       method: 'delete',
       url: config.host + 'post/' + post_id,
       headers: {
         Authorization: 'Bearer ' + getToken()
       }
     })
     promise.done(function (response) {
       alert('Deletado com sucesso')
       getPostAjax()
     })

     promise.fail(function (response) {
       alert('Erro ao deletar')
     })
   }
 })

 //cancela edição de um formulario
 $(document).on('click', '#commentCancel', function (e) {
   e.preventDefault()
   var comment_id = $(this).data('comment_id')
   $('#editCommentShow_' + comment_id).empty()
 })

 //abre modal de registro
 $(document).on('click', '#doLogin', function (e) {
   e.preventDefault()
   doLogin()
 })

 //abre formulario para salvar comentário
 $(document).on('click', '.save_comment', function (e) {
   e.preventDefault()
   var post_id = $(this).data('post_id')
   $('#showComment_' + post_id).html(getCommentForm(post_id))
 })

 //abre o formulario de edição de cadastro
 $(document).on('click', '.edit_post', function (e) {
   e.preventDefault()
   var post_id = $(this).data('post_id')
   $('#showPost_' + post_id).html(getPostEditForm(post_id))
 })

 //Ajax Salva um comentário para um post
 $(document).on('click', '#commentSave', function (e) {
   e.preventDefault()
   var post_id = $(this).data('post_id')
   var message = $('#commentText_' + post_id).val()
   var token_vrau = getToken()
   var user = getUserInfo()
   if (token_vrau !== null) {

     var promise = $.ajax({
       method: 'post',
       url: config.host + 'comment',
       data: {
         comment: message,
         user_id: user.id,
         post_id: post_id
       },
       headers: {
         Authorization: 'Bearer ' + token_vrau
       }
     })

     promise.done(function (response) {
       alert('Salvo com sucesso!')
       $('#showComment_' + post_id).empty()
       getPostAjax()
     })

     promise.fail(function (response) {
       alert('Houve um erro!')
     })

   } else {
     alert('Precisa Fazer Login')
     $('#modalLogin').modal('show')
   }
 })

 //Ajax faz o registro 
 $(document).on('click', '#register', function (e) {
   e.preventDefault()
   var email = $('#email_register')
   var password = $('#password_register')
   var username = $('#username_register')
   if (email.val() !== null && password.val() !== null && username.val() !== null) {
     //ajax register
     var promise = $.ajax({
       method: 'post',
       url: config.host + 'user/register',
       data: {
         username: username.val(),
         password: password.val(),
         email: email.val()
       }
     })

     promise.done(function (response) {
       alert('Salvo com sucesso')
       email.val("")
       password.val("")
       username.val("")
       $('#modalRegister').modal('hide')
     })

     promise.fail(function (error) {
       alert('Não possivel salvar este usuario!')
     })
   }
 })

 //abre a edição de comentários
 $(document).on('click', '.edit_comment', function (e) {
   e.preventDefault()
   var comment_id = $(this).data('comment_id')
   $('#editCommentShow_' + comment_id).html(getCommentEditForm(comment_id))
 })

 //salvar a edição de um comentário
 $(document).on('click', '#commentEdit', function (e) {

   e.preventDefault()
   var comment_id = $(this).data('comment_id')
   var commentText = $('#commentText_' + comment_id).val()
   var user = getUserInfo()

   var object = {
     'user_id': user.id,
     'comment': commentText
   }

   var promise = $.ajax({
     method: 'put',
     url: config.host + 'comment/' + comment_id,
     data: object,
     headers: {
       Authorization: 'Bearer ' + getToken()
     }
   })

   promise.done(function (response) {
     $('#commentCancel').click() //TODO: melhorar isso
     alert('Alterado com sucesso')
     getPostAjax()
   })

   promise.fail(function (response) {
     alert('Erro ao atualizar')
   })
 })

 //salva a edição de um post
 $(document).on('click', '#postEdit', function () {

   var post_id = $(this).data('post_id')
   var postText = $('#postText_' + post_id).val()
   var user = getUserInfo()
   var object = {
     'user_id': user.id,
     'post': postText
   }
   var promise = $.ajax({
     method: 'put',
     url: config.host + 'post/' + post_id,
     data: object,
     headers: {
       Authorization: 'Bearer ' + getToken()
     }
   })

   promise.done(function (response) {
     $('#postCancel').click() //TODO: melhorar isso
     alert('Alterado com sucesso')
     getPostAjax()
   })

   promise.fail(function (response) {
     alert('Erro ao atualizar')
   })
 })

 //salva um post
 $(document).on('click', '#postSave', function () {

   var postText = $('#postText').val()
   var user = getUserInfo()
   var object = {
     'user_id': user.id,
     'post': postText
   }
   var promise = $.ajax({
     method: 'post',
     url: config.host + 'post',
     data: object,
     headers: {
       Authorization: 'Bearer ' + getToken()
     }
   })

   promise.done(function (response) {
     $('#postCancel').click() //TODO: melhorar isso
     alert('Salvo com sucesso')
     getPostAjax()
     $('#postText').val('')
   })

   promise.fail(function (response) {
     alert('Erro ao atualizar')
   })
 })

 //fecha a exibição de post
 $(document).on('click', '#postCancel', function () {
   var post_id = $(this).data('post_id')
   $('#showComment_' + post_id).empty()
   $('#showPost_' + post_id).empty()
 })

 $(document).on('click', '#doLogout', function () {
   var user = getUserInfo()
   var promise = $.ajax({
     method: 'post',
     url: config.host+"user/logout",
     data: {
       user_id: user.id
     },
     headers: {
       Authorization: 'Bearer ' + getToken()
     }
   })

   promise.done(function(response){
     $('#btnLogin').css('display','inline')
     $('.logoutBtn').empty()
     window.localStorage.removeItem('user_vrautwit')
     window.localStorage.removeItem('token_vrautwit')
     getPostAjax()
     alert(response.message)
   })

   promise.fail(function(){
      alert('Erro ao fazer logout')
   })
 })
 //funções

 //testa se o usuario esta logado e coloca o formularia coloca o formulario para novos posts
 var thPost = function () {
   var user_data = getUserInfo()
   if (user_data !== null) {
     $('#btnLogin').css('display','none')
     $('.logoutBtn').html('<a href="#" class="btn btn-primary" id="doLogout">Logout</a>')
     $('.thPost').html(getPostForm())
   }
 }

 //formulario de salvamento de Comentarios
 var getCommentForm = function (post_id) {
   let html = ""
   html += '<textarea class="form-control" id="commentText_' + post_id + '"></textarea><br>'
   html += '<a href="#" class="btn btn-primary btn-xs" id="commentSave" data-post_id="' + post_id + '">Comentar</a>'
   html += '<a href="#" class="btn btn-danger btn-xs" id="postCancel" data-post_id="' + post_id + '">Cancelar</a>'
   return html
 }

 //formulario de edição de comentarios
 var getCommentEditForm = function (comment_id) {
   let html = ""
   html += '<textarea class="form-control" id="commentText_' + comment_id + '">' + ($('.message_edit_' + comment_id).text()) + '</textarea><br>'
   html += '<a href="#" class="btn btn-primary btn-xs" id="commentEdit" data-comment_id="' + comment_id + '">Comentar</a>'
   html += '<a href="#" class="btn btn-danger btn-xs" id="commentCancel" data-comment_id="' + comment_id + '">Cancelar</a>'
   return html
 }

 //formulario de salvamento de posts
 var getPostForm = function () {
   let html = ""
   html += '<textarea class="form-control" id="postText"></textarea><br>'
   html += '<a href="#" class="btn btn-primary btn-xs" id="postSave">POSTAR</a>'
   return html;
 }

 //formulario de salvamento de posts
 var getPostEditForm = function (post_id) {
   let html = ""
   html += '<textarea class="form-control" id="postText_' + post_id + '">' + ($('.message_post_' + post_id).text()) + '</textarea><br>'
   html += '<a href="#" class="btn btn-primary btn-xs" id="postEdit" data-post_id="' + post_id + '">Comentar</a>'
   html += '<a href="#" class="btn btn-danger btn-xs" id="postCancel" data-post_id="' + post_id + '">Cancelar</a>'
   return html;
 }

 //html de um comentario
 var getCommentHtml = function (data) {
   var html = '<div class="comment_' + data.id + '">' +
     '<span class="user_info">' + data.user.username + '</span>' +
     '<span class="message_edit_' + data.id + '">' + data.comment + '</span>'

   var userData = getUserInfo()
   if (userData !== null) {
     if (userData.id == data.user_id) {
       html += ' <a href="#" class="btn btn-success btn-xs edit_comment" id="editComment_' + data.id + '" data-comment_id="' + data.id + '">Editar</a>' +
         '<a href="#" class="btn btn-danger btn-xs delete_comment" id="deleteComment_' + data.id + '" data-comment_id="' + data.id + '">Delete</a>';
     }
   }
   return html + '<div class="showPost" id="editCommentShow_' + data.id + '"></div></div>'
 }
 //html de um post
 var showPostHtml = function (info_post) {
   $.get('components/post_component.html', function (data) {
     data = data
       .replace('[user]', info_post.user.username)
       .replace('[post_message]', info_post.post)
       .replace('[post_id]', info_post.id)
       .replace('[post_id]', info_post.id)
       .replace('[post_id]', info_post.id)
       .replace('[post_id]', info_post.id)
     html = ""
     info_post.comment.reverse()
     for (i = 0; i < info_post.comment.length; i++) {
       html += getCommentHtml(info_post.comment[i])
     }
     var userData = getUserInfo()
     if (userData !== null) {
       if (userData.id == info_post.user_id) {
         data = data.replace('[btn-editar]',
           '<a href="#" class="btn btn-success btn-xs edit_post" data-post_id="' + info_post.id + '" id="editPost_' + info_post.id + '">Editar</a>' +
           '<a href="#" class="btn btn-danger btn-xs delete_post" data-post_id="' + info_post.id + '" id="deletePost_' + info_post.id + '">Delete</a>'
         )
       } else {
         data = data.replace('[btn-editar]', '')
       }
     } else {
       data = data.replace('[btn-editar]', '')
     }
     data = data.replace('[list_comments]', html)

     var olderList = $('.list_posts').html()
     $('.list_posts').html(olderList + data)
   })
 }
 //faz login :)
 var doLogin = function () {
   var email = $('#email')
   var password = $('#password')
   if (email.val() !== null && password.val() !== null) {
     //ajax login
     var promise = $.ajax({
       method: 'post',
       url: config.host + 'user/login',
       data: {
         password: password.val(),
         email: email.val()
       }
     })

     promise.done(function (response) {
       window.localStorage.setItem('token_vrautwit', response.token.token)
       window.localStorage.setItem('user_vrautwit', JSON.stringify(response.user_vrautwit))
       alert('Login efetuado com sucesso! :)')
       email.val("")
       password.val("")
       $('#modalLogin').modal('hide')
       thPost()
       getPostAjax()
     })

     promise.fail(function (response) {
       console.log(response)
       alert('Não foi possivel fazer login')
     })
     //
   } else {
     alert('Preencha o formulario')
   }
 }

 //ta obvio
 var getToken = function () {
   return window.localStorage.getItem('token_vrautwit')
 }

 //ta obvio
 var getUserInfo = function () {
   return JSON.parse(window.localStorage.getItem('user_vrautwit'))
 }

 //Ajax obtém posts e lista-os na tela
 var getPostAjax = function () {
   $('.list_posts').html('')
   var promise = $.ajax({
     method: 'get',
     url: config.host + 'post'
   })

   promise.done(function (response) {
     response = response.reverse();
     for (i = 0; i < response.length; i++) {
       showPostHtml(response[i])
     }
   })

   promise.fail(function (response) {
     console.log(response)
   })
 }
