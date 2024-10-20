import { defer } from "@remix-run/node"; // or "@remix-run/server-runtime"
import { Await, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { Suspense, useState, useEffect } from "react";
import Button from "component/Button";

// メタ情報設定
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// Loader function runs on the server-side
export async function loader() {
  // Load environment variable 'TEST'
  const testEnv = process.env.TEST;

  // APIアクセスに遅延を追加してレスポンスをシミュレート
  const response = new Promise((resolve) => {
    setTimeout(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      resolve(data.slice(0, 5)); // データの一部のみ返す
    }, 3000); // 3秒の遅延
  });

  // 現在の日付をシミュレート
  const currentDate = new Date();

  return defer({
    date: currentDate,
    testEnv,
    apiData: response, // 非同期データを遅延して返す
  });
}

type LoaderData = {
  date: Date;
  testEnv: string | undefined;
  apiData: Promise<any>; // 非同期データ
};

export default function Index() {
  const { date, testEnv, apiData } = useLoaderData<LoaderData>();

  const [isLoading, setIsLoading] = useState(true);

  // useEffect を使ってコンポーネントがマウントされた時にローダーを表示し、データが読み込まれたらローダーを非表示にする
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false); // 3秒後にローダーを非表示にする
    }, 3000);

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-16">
        {/* ローダーを即座に表示 */}
        {isLoading ? (
          <InitialSpinner />
        ) : (
          <>
            {/* 最低限のレイアウトがここに表示される */}
            <header className="flex flex-col items-center gap-9">
              <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
                DASH<span className="sr-only">Remix</span>
              </h1>
              <Link to="/dashboard">Dashboard123ooo {testEnv}</Link>
            </header>

            {/* データ取得中に回転ローダーを表示 */}
            <div className="card shadow-md p-6 rounded-lg">
              <h2>API Data:</h2>
              <Suspense fallback={<Spinner />}>
                <Await resolve={apiData}>
                  {(data) => (
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                  )}
                </Await>
              </Suspense>
            </div>

            {/* 他のコンテンツ */}
            <Button to="/">This is button Component</Button>
          </>
        )}
      </div>
    </div>
  );
}

// 最初に即座に表示するローダー
function InitialSpinner() {
  return (
    <div className="initial-loader" style={{ textAlign: "center", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="spin" />
      <style>{`
        .spin {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s ease infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// データ取得中に表示するローダー
function Spinner() {
  return (
    <div className="loader" style={{ textAlign: "center" }}>
      <div className="spin" />
      <style>{`
        .spin {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s ease infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const resources = [
  {
    href: "https://remix.run/start/quickstart",
    text: "Quick Start (5 min)",
  },
  {
    href: "https://remix.run/start/tutorial",
    text: "Tutorial (30 min)",
  },
  {
    href: "https://remix.run/docs",
    text: "Remix Docs",
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
  },
];
