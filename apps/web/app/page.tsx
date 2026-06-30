import Navbar from "@/components/navbar";
import Hero from "@/components/landing/hero";
import Installation, { BinaryRelease } from "@/components/landing/installation";
import Footer from "@/components/footer";

export const revalidate = 5 * 60; // 5 minutes

interface LatestReleaseData {
  binaryReleases: BinaryRelease[];
  latestVersion?: string;
}

async function getLatestReleases(): Promise<LatestReleaseData> {
  let latestVersion: string | undefined;
  let binaryReleases: BinaryRelease[] = [];

  try {
    const res = await fetch(
      "https://api.github.com/repos/itskdhere/dsmt/releases/latest"
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    if (data) {
      if (data.tag_name) {
        latestVersion = data.tag_name;
      }
      if (Array.isArray(data.assets)) {
        const mapped: BinaryRelease[] = data.assets
          .map((asset: any): BinaryRelease => {
            const name = asset.name || "";
            let platform = "Unknown";
            let arch = "Unknown";

            if (name.includes("windows")) {
              platform = "Windows";
            } else if (name.includes("macos") || name.includes("darwin")) {
              if (name.includes("arm64")) {
                platform = "macOS (Apple Silicon)";
              } else {
                platform = "macOS (Intel)";
              }
            } else if (name.includes("linux")) {
              platform = "Linux";
            }

            if (name.includes("arm64")) {
              arch = "ARM64";
            } else if (name.includes("x64") || name.includes("amd64")) {
              arch = "x64";
            }

            const sizeInMB = (asset.size / (1024 * 1024)).toFixed(1) + " MB";
            const sha256 = asset.digest
              ? asset.digest.replace("sha256:", "")
              : "";

            return {
              platform,
              arch,
              filename: name,
              size: sizeInMB,
              sha256,
              downloadUrl: asset.browser_download_url || "",
            };
          })
          .filter((item: BinaryRelease) => item.platform !== "Unknown");

        const getOrderIndex = (item: BinaryRelease) => {
          if (item.platform === "Windows") return 0;
          if (item.platform === "macOS (Apple Silicon)") return 1;
          if (item.platform === "macOS (Intel)") return 2;
          if (item.platform === "Linux" && item.arch === "x64") return 3;
          if (item.platform === "Linux" && item.arch === "Arm64") return 4;
          return 5;
        };

        mapped.sort((a, b) => getOrderIndex(a) - getOrderIndex(b));
        binaryReleases = mapped;
      }
    }
  } catch (err) {
    console.error("Failed to fetch latest releases from GitHub:", err);
  }
  return { binaryReleases, latestVersion };
}

export default async function LandingPage() {
  const { binaryReleases, latestVersion } = await getLatestReleases();

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-text-primary selection:bg-primary-accent/30 selection:text-text-primary">
      <Navbar />
      <main>
        <Hero latestVersion={latestVersion} />
        <Installation binaryReleases={binaryReleases} />
      </main>
      <Footer />
    </div>
  );
}
