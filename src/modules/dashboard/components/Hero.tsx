// Images
import HeroImage from "@/app/assets/images/hero.png";
import HeroImageWebp from "@/app/assets/images/hero.webp";

// i18n
import { useTranslation } from "react-i18next";

// React Router DOM
import { Link } from "react-router-dom";

// Hooks
import { usePrefetchRoute } from "@/app/hooks/usePrefetchRoute";

// Routes — cross-module chunk loaders live in the composition root, so a
// feature module never imports a sibling module directly (see route-loaders).
import { routeLoaders } from "@/app/routes/route-loaders";

export const Hero = () => {
  const { t } = useTranslation("dashboard");

  // Warm the login chunk on hover/focus — the same thunk authentication.router
  // wraps in lazy(), so we prefetch exactly the chunk that will render.
  const prefetchLogin = usePrefetchRoute(routeLoaders.authenticationLogin);

  return (
    <section className="font-be-vietnam bg-dark-1 h-screen">
      <nav className="px-4 mx-auto max-w-screen-2xl lg:px-24 lg:pt-7 pt-5">
        <div className="flex flex-col w-full lg:flex-row lg:items-center gap-5 divide-gray-700 lg:divide-x">
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-2 text-xl text-white font-bold">
              <AppBaseSvg name="icon-checkmark" />
              Apiiyu.
            </div>
            <div>
              <button className="block p-1 outline-none lg:hidden mobile-menu-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`flex w-full mx-auto mobile-menu lg:block`}
            id="navigation"
          >
            <div className="flex flex-col items-baseline justify-between mx-auto mt-6 lg:flex-row lg:items-center lg:mt-0">
              <div className="flex flex-col w-full text-base font-normal text-white lg:flex-row lg:w-max lg:pl-4">
                <a href="#" className="py-3 pl-2 mx-2 lg:mr-9 lg:pl-0">
                  {t("nav.pricing")}
                </a>
                <a href="#" className="py-3 pl-2 mx-2 lg:mr-9 lg:pl-0">
                  {t("nav.features")}
                </a>
                <a href="#" className="py-3 pl-2 mx-2 lg:mr-9 lg:pl-0">
                  {t("nav.showcase")}
                </a>
                <a href="#" className="py-3 pl-2 mx-2 lg:mr-9 lg:pl-0">
                  {t("nav.tools")}
                </a>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-7 w-full px-3 mt-4 lg:mt-0 lg:w-max lg:px-0">
                <Link
                  to="/authentication/login"
                  {...prefetchLogin}
                  className="w-full lg:w-auto px-5 py-3 text-center rounded-lg flex lg:mx-auto bg-transparent transition ease-out duration-200 hover:bg-white hover:bg-opacity-30"
                >
                  <span className="text-base w-full font-semibold text-white">
                    {t("nav.signIn")}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-20 px-4 mx-auto max-w-screen-2xl lg:px-24">
        <div className="grid grid-cols-12 items-center justify-center">
          <div className="col-span-12 md:col-span-5 lg:col-span-6">
            <div>
              <div className="headline font-bold text-4xl lg:text-5xl text-white leading-normal lg:leading-snug">
                {t("hero.headlineLine1")}
                <br className="d-none md:d-block" />
                {t("hero.headlineLine2")}
              </div>
              <div className="mt-5 mb-9">
                <p className="font-normal text-sm lg:text-base text-white leading-7">
                  {t("hero.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-7">
                <a href="#" className="py-3 px-5 rounded-lg bg-champ-green">
                  <span className="text-base text-center font-semibold text-dark-2">
                    {t("hero.getStarted")}
                  </span>
                </a>
                <a
                  href="#"
                  className="py-3 px-5 rounded-lg bg-transparent transition ease-out duration-200 hover:bg-white hover:bg-opacity-30"
                >
                  <span className="text-tile-grey font-normal underline text-base">
                    {t("hero.watchStories")}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-6 lg:mt-0 mt-14">
            <picture>
              <source srcSet={HeroImageWebp} type="image/webp" />
              <img
                src={HeroImage}
                alt="headerly-kodechamp"
                width={1200}
                height={849}
                // Above-the-fold LCP candidate — never lazy-load this one.
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </main>
    </section>
  );
};
