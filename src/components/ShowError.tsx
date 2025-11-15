import { PropsError } from "../schemas/utils";

export const ShowError = ({ messageError }: PropsError) => {
    return (
        <div
            className="flex items-center text-red-500 text-center my-4 font-semibold"
            role="alert"
            aria-live="assertive"
        >
            {messageError}
        </div>
    );
};

export default ShowError;