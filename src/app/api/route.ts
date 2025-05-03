import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.FEEDER_API_URL ?? "";

const trimSlashes = (uri: string) => {
  return uri.replace(/(^\/|\/$)/g, "");
};

function buildApiUrl(searchParams: URLSearchParams) {
  const apiUri = searchParams.get("apiUrl") || "";
  const url = new URL(`${apiUrl}/${trimSlashes(apiUri)}`);
  // console.log({ apiUri, url });
  searchParams.forEach((value, key) => {
    // console.log({ key, value });
    if (key === "apiUrl") {
      return;
    }
    url.searchParams.set(key, value);
  });
  return url;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = buildApiUrl(searchParams);
    console.log({ url });
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return Response.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = buildApiUrl(searchParams);
    let body: any;
    try {
      body = await request.json();
    } catch (e) {
      body = null;
    }
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(url, fetchOptions);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = buildApiUrl(searchParams);
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    body = null;
  }
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    // @ts-ignore
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, requestOptions);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = buildApiUrl(searchParams);
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return Response.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
