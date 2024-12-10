import ResetPasswordForm from './reset-password-form';

// Remove all type annotations and async
export default function Page(props) {
  return <ResetPasswordForm token={props.params.token} />;
}
