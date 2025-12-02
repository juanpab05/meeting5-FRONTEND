export const Loading = () => {
    return (
        <div
            className="absolute flex justify-center items-center h-40"
            role="status"
            aria-live="polite"
            aria-label="Cargando contenido"
        >
            <div
                className="animate-spin rounded-full h-10 w-10 
                           border-4 border-gray-300 border-t-red-600"
                aria-hidden="true"
            ></div>
            <span className="sr-only">Cargando...</span>
        </div>
    );
};

export default Loading;
