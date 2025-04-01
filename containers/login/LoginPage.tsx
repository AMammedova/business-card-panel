"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import UsernameIcon from "./icons/UsernameIcon";
import MailIcon from "./icons/mailIcon";
import { useLogin } from "@/hooks/api/useAuth";
import LanguageSwitcher from "@/shared/components/Switcher/LanguageSwitcher";
import { z } from "zod";

const LoginPage = () => {
  const t = useTranslations("login");
  const tvalidation = useTranslations("login.validation");
  const { mutate, isPending } = useLogin();
  const [error, setError] = useState<string | null>(null);
  const schema = z.object({
    username: z.string().min(3, tvalidation("username_min")),
    password: z.string().min(6, tvalidation("password_min")),
  });
  type LoginSchemaType = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginSchemaType) => {
    mutate(data, {
      onError: () => setError(t("login_error")),
    });
  };

  return (
    <div className="h-screen flex">
      <div className="absolute top-5 right-5">
        <LanguageSwitcher />
      </div>

      <div className="flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            {t("side_title")}
          </h1>
          <p className="text-white mt-1">{t("side_description")}</p>
        </div>
      </div>

      <div className="flex w-1/2 justify-center items-center bg-white">
        <form className="bg-white w-1/2" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">
            {t("welcome_title")}
          </h1>
          <p className="text-sm font-normal text-gray-600 mb-7">
            {t("welcome_subtitle")}
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Username */}
          <div className="mb-4">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <UsernameIcon />
              <input
                className="pl-2 outline-none border-none py-2 w-full"
                type="text"
                placeholder={t("email_placeholder")}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <MailIcon />
              <input
                className="pl-2 outline-none border-none py-2 w-full"
                type="password"
                placeholder={t("password_placeholder")}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="block w-full bg-indigo-600 mt-4 py-3 rounded-2xl text-white font-semibold mb-2"
          >
            {isPending ? t("loading") : t("login")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
