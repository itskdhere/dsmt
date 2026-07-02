import Navbar from "@/components/navbar";
import Hero from "@/components/landing/hero";
import Install, { BinaryRelease } from "@/components/landing/install";
import Demo from "@/components/landing/demo";
import Docs from "@/components/landing/docs";
import Footer from "@/components/footer";

export const revalidate = 300; // 5 minutes

interface LatestReleaseData {
  binaryReleases: BinaryRelease[];
  latestVersion?: string;
}

interface GitHubAsset {
  name: string;
  size: number;
  digest?: string;
  browser_download_url?: string;
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
          .map((asset: GitHubAsset): BinaryRelease => {
            const name = asset.name || "";
            let platform = "Unknown";
            let arch = "Unknown";

            if (name.includes("windows")) {
              platform = "Windows";
            } else if (name.includes("macos") || name.includes("darwin")) {
              platform = "macOS";
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
          if (item.platform === "Windows" && item.arch === "x64") return 0;
          if (item.platform === "Linux" && item.arch === "x64") return 1;
          if (item.platform === "macOS" && item.arch === "x64") return 2;
          if (item.platform === "Windows" && item.arch === "ARM64") return 3;
          if (item.platform === "Linux" && item.arch === "ARM64") return 4;
          if (item.platform === "macOS" && item.arch === "ARM64") return 5;
          return 6;
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
        <Demo />
        <Install binaryReleases={binaryReleases} />
        <Docs />
      </main>
      <Footer />
    </div>
  );
}
