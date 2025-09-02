import { cn } from "@/utils/utils";

interface SubscriptionOverlayProps {
  className?: string;
  isPastDue?: boolean;
}

export const SubscriptionOverlay = ({
  className,
  isPastDue,
}: SubscriptionOverlayProps) => {
  return (
    <div
      className={cn(
        "tw:bg-white/70 tw:flex-col tw:h-auto tw:w-fit tw:max-md:max-w-72 tw:min-w-64 tw:sm:min-w-72 tw:md:min-w-80 tw:lg:min-w-md tw:backdrop-blur-sm tw:flex tw:items-center tw:justify-center tw:p-4",
        className
      )}
    >
      {isPastDue ? (
        <>
          <h3 className="">Subscription Update Required</h3>
          <div className="tw:max-w-[17rem] tw:lg:max-w-sm tw:xl:max-w-[29rem] tw:text-center">
            <p className="tw:text-pretty tw:mb-4">
              Your Swellnet Pro subscription needs attention. Please update your
              payment details to continue enjoying premium forecasts and
              advanced features.
            </p>
            <a
              href="/pro/manage"
              className="tw:inline-flex tw:items-center tw:justify-center tw:w-fit tw:px-6 tw:py-3 tw:font-medium tw:transition-all tw:duration-200"
            >
              Update Payment Details
            </a>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-center">Premium Forecast</h3>
          <div className="tw:max-w-full tw:md:max-w-[17rem] tw:lg:max-w-sm tw:xl:max-w-[29rem] tw:text-center">
            <p className="tw:text-pretty">
              Subscribe to access our full forecast data and unlock detailed
              swell predictions, advanced charts, and more.
            </p>

            <div className="tw:space-y-4">
              <a
                href="/pro/subscribe/chooseplan"
                className="text-color-white swell-bg tw:inline-flex tw:items-center tw:justify-center tw:w-fit tw:px-6 tw:py-3 tw:font-medium tw:transition-all tw:duration-200 tw:transform hover:tw:-translate-y-0.5"
              >
                Subscribe Now
              </a>
              <div className="tw:relative tw:py-2">
                <div className="tw:absolute tw:inset-0 tw:flex tw:items-center">
                  <div className="tw:w-full tw:border-t tw:border-gray-200"></div>
                </div>
                <div className="tw:relative tw:flex tw:justify-center">
                  <span className="tw:px-2 tw:bg-white/80 tw:text-sm tw:text-gray-500">
                    or
                  </span>
                </div>
              </div>
              <a
                href={`/user/login?destination=${encodeURIComponent(
                  window.location.pathname
                )}`}
                className="tw:inline-flex tw:items-center tw:justify-center tw:w-full tw:font-medium tw:transition-colors tw:duration-200 tw:text-balance"
              >
                Already a subscriber? Sign in
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
