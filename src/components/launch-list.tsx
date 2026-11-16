import { LaunchListForm } from "@/components/launch-list-form";
import { getI18n } from "@/lib/locale-server";
import { whatsappLink } from "@/lib/site";

/**
 * "Join the US launch list": email sign-up (see app/actions/launch-list.ts for
 * where emails go) with WhatsApp as the alternative.
 */
export async function LaunchList({ source = "site" }: { source?: string }) {
  const { t } = await getI18n();
  return (
    <section id="launch-list" className="scroll-mt-24 bg-onyx text-cream">
      <div className="container-site grid gap-10 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow text-arena">{t.launch.eyebrow}</p>
          <h2 className="display-md mt-4">{t.launch.title}</h2>
          <p className="mt-5 max-w-md text-cream/70">{t.launch.body}</p>
        </div>
        <div className="flex md:justify-end">
          <LaunchListForm
            source={source}
            whatsappHref={whatsappLink(t.whatsapp.launchList)}
          />
        </div>
      </div>
    </section>
  );
}
