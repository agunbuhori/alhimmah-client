<template lang="pug">
  .wrapper.centered-column
    .login-form.full-width.ph-2
      .text-center
        img.logo(src="/logo-circle.png")
      .form-group
        label Email atau username
        input.form-control(type="text" placeholder="Masukkan email atau username" v-model="email")
        
      .form-group
        label Kata sandi
        input.form-control(type="password" placeholder="Masukkan kata sandi" v-model="password")
      
      .form-group(v-if="loginFailed")
        p.text-center.text-danger Login gagal

      .form-group
        button.btn.btn-primary.btn-block(@click="login()" :disabled="! email || ! password") {{ progress ? "Memuat..." : "Masuk" }}

      .form-group
        p.text-center.text-muted atau masuk dengan

      .social
          button#google.social-button Google
          button#facebook.social-button(@click="loginWithFacebook()") Facebook
</template>

<script>
export default {
  data() {
    return {
      name: "User",
      email: "",
      password: "",
      progress: false,
      loginFailed: false
    };
  },
  mounted() {
    this.startGoogleApi();
    this.startFacebookApi();
  },
  methods: {
    login() {
      this.changeAuth({
        email: this.email,
        password: this.password,
        avatar: "",
        id: ""
      });
    },
    async changeAuth(user) {
      // return false;
      try {
        const { id, email, name, social, avatar, password } = user;
        let response = await this.$auth.loginWith('local', {
          data: {
            id,
            name,
            email,
            avatar,
            password: password ? password : id,
            social
          }
        });
        if (response.status === 200) {
          await this.$auth.setUserToken(response.data.access_token);
          await this.$auth.setUser(response.data.user);
        }
      } catch (error) {
        console.log(error);
        this.loginFailed = true;
        this.password = "";
      }
      this.progress =false;
    },
    startGoogleApi() {
      const _vn = this;
      function attachSignin(element) {
        auth2.attachClickHandler(
          element,
          {},
          function(googleUser) {
            let auth = googleUser.getBasicProfile();
            _vn.progress = true;
            _vn.changeAuth({
              id: auth.getId(),
              name: auth.getName(),
              email: auth.getEmail(),
              avatar: auth.getImageUrl(),
              social: "google"
            });
          },
          function(error) {}
        );
      } 

      if (typeof gapi !== 'undefined') {
        gapi.load("auth2", function() {
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          window.auth2 = gapi.auth2.init({
            client_id:
              "551209414233-q65806mceen0tq9hcat1859kk49gr3cq.apps.googleusercontent.com",
            cookiepolicy: "single_host_origin"
            // ux_mode: "redirect",
            // redirect_uri: "/login"
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
          });
          attachSignin(document.getElementById("google"));
        });
      }
    },

    startFacebookApi() {
      window.fbAsyncInit = function() {
        FB.init({
          appId: "718130725673863",
          cookie: true,
          xfbml: true,
          version: "v7.0"
        });

        FB.AppEvents.logPageView();
      };

      (function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    },

    loginWithFacebook() {
      const _vn = this;
      FB.login(function(response) {
          if (response.authResponse) {
            FB.api('/me', {fields: 'id,name,email,picture'}, function(response) {
              const { id, name, email, picture } = response;
              _vn.progress = true;
              _vn.changeAuth({
                id, name, email, avatar: picture.data.url, social: "facebook"
              });
            });
          }
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.wrapper
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

.logo
  width: 150px
  margin-bottom: 20px

.social
  display: flex
  justify-content: space-between
  flex-direction: row
  width: 100%
  
  button
    border-radius: 50px
    border: none
    width: 48%
    height: 40px
    margin-bottom: 15px
    font-weight: bold
    display: flex
    justify-content: center
    align-items: center
    position: relative
    padding-left: 30px
    background-color: #ddd

    &::before
      content: ""
      width: 40px
      height: 40px
      position: absolute
      left: 0
      background-position: center
      background-size: 60%
      background-repeat: no-repeat
    &:hover
      background-color: darken(#eee, 4)

  #google::before
    background-image: url('/social/google.png')
  #facebook::before
    background-image: url('/social/facebook.png')
 
</style>
