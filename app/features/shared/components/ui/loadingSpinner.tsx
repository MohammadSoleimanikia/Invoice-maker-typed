import { Spinner } from "./spinner";

export default function LoadingSpinner() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Spinner className="size-9 text-primary"/>
        </div>
    );
}