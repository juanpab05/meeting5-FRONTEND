import { PropsError } from "../schemas/utils";

export const ShowError = ({ messageError }: PropsError) => {
    return (
        <div
            className="flex items-center justify-center my-4"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <p className="text-red-600 text-center font-semibold">
                {messageError}
            </p>
        </div>
    );
};

export default ShowError;
