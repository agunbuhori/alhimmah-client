export default function({ $auth, redirect }) {  
    if ($auth.loggedIn) {
      window.location.href = '/';
    }
}
