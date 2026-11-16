import { SignatureLoader } from "@/components/signature-mark";

/** Route loading screen: the signing isotipo, small and centered. */
export default function Loading() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center">
      <SignatureLoader />
    </div>
  );
}
