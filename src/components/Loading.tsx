export const Loading = () => {
    return (
        <div
            className="absolute flex justify-center items-center h-40"
            role="status"
            aria-live="polite"
        >
            <div
                className="animate-spin rounded-full h-10 w-10 border-t-4 border-red-500"
                aria-hidden="true"
            ></div>
            <span className="sr-only">Cargando...</span>
        </div>
    );
};

export default Loading;