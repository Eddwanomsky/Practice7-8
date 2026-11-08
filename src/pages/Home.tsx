import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {
    const [t, i18n] = useTranslation();

    const onTranslateButtonClick = async (): Promise<void> => {
        if (i18n.resolvedLanguage === "en") {
            await i18n.changeLanguage("es");
        } else {
            await i18n.changeLanguage("en");
        }
    };

    return (
        <div className="bg-blue-300 font-bold w-screen h-screen flex flex-col justify-center items-center gap-4">
            <p className="text-white text-6xl">{t("home.greeting")}</p>
            

            <p className="text-white text-xl font-normal">
                Лабораторна робота 7
            </p>

            <button
                className="hover:cursor-pointer text-white bg-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                type="submit"
                onClick={onTranslateButtonClick}
            >
                translate
            </button>
        </div>
    );
};