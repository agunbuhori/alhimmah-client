export default async function({ $auth, redirect }) {  
  let user = await $auth.user;

  if (! $auth.loggedIn) {
      window.location.href = '/login';
    }
}
