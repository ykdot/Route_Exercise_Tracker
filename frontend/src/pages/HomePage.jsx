import { Link, redirect } from "react-router-dom";

function HomePage() {

  function redirectToPolar() {
    redirect('https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc');
    }
  console.log(window.location.href)

  return (
    <Link to='https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc'>Authentication</Link>
  );
}

export default HomePage;