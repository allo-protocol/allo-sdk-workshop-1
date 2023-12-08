const Error = (props: { message: string }) => {
  return (
    <div>
      <p className="mt-2 text-sm text-red-600" id="email-error">
        {props.message}
      </p>
    </div>
  );
};

export default Error;
