import test from "node:test";
import assert from "node:assert/strict";
import { analyzeHtml, normalizeUrl, scanUrl } from "../lib/scan.mjs";

const goodHtml = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>مصنع النيل للمعادن — مكونات دقيقة للتصدير</title><meta name="description" content="مصنع مصري معتمد ISO 9001 ينتج مكونات معدنية دقيقة لأسواق التصدير مع طاقة إنتاجية عالية وطلب عرض سعر مباشر خلال 24 ساعة."><link rel="canonical" href="https://example.com/"><link rel="alternate" hreflang="ar" href="https://example.com/"><link rel="alternate" hreflang="en" href="https://example.com/en"><link rel="icon" href="/favicon.ico"><meta property="og:title" content="x"><meta property="og:description" content="y"><script type="application/ld+json">{"@type":"Organization"}</script></head><body><h1>مكونات دقيقة لأسواق التصدير</h1><p>${"شهادات الجودة والطاقة الإنتاجية والتصدير للمصانع والموزعين ".repeat(60)}</p><img src="a.jpg" alt="المصنع"><img src="b.jpg" alt="خط الإنتاج"><img src="c.jpg" alt="الشهادات"><form></form><a href="https://wa.me/2010">اطلب عرض سعر</a><a href="tel:+20">اتصل</a> Request a quote · RFQ · certifications · export · capacity</body></html>`;

const weakHtml = `<html><head><title>Home</title></head><body><div>Welcome</div><img src="x.png"></body></html>`;

test("normalizes and rejects unsafe URLs", () => {
  assert.equal(normalizeUrl("example.com/path").href, "https://example.com/path");
  assert.equal(normalizeUrl("localhost:3000"), null);
  assert.equal(normalizeUrl("http://127.0.0.1/"), null);
  assert.equal(normalizeUrl("ftp://x.com"), null);
  assert.equal(normalizeUrl(""), null);
});

test("scores a well-built bilingual industrial site highly", () => {
  const report = analyzeHtml({ html: goodHtml, bytes: goodHtml.length, ttfb: 120, totalMs: 300, finalUrl: "https://example.com/", status: 200 }, new URL("https://example.com/"));
  assert.equal(report.checks.length, 10);
  assert.ok(report.total >= 80, `total was ${report.total}`);
  assert.equal(report.checks.find((c) => c.key === "security").score, 10);
  assert.ok(report.checks.every((c) => c.label.ar && c.label.en && c.advice.ar && c.advice.en));
});

test("scores a thin template page low and names the weakest areas", () => {
  const report = analyzeHtml({ html: weakHtml, bytes: weakHtml.length, ttfb: 1200, totalMs: 4000, finalUrl: "http://weak.example/", status: 200 }, new URL("http://weak.example/"));
  assert.ok(report.total < 40, `total was ${report.total}`);
  assert.equal(report.weakest.length, 3);
  assert.equal(report.checks.find((c) => c.key === "security").status, "bad");
});

test("scanUrl wraps fetch failures and non-HTML responses", async () => {
  const failing = async () => { const e = new Error("x"); e.name = "AbortError"; throw e; };
  assert.deepEqual(await scanUrl("example.com", failing), { ok: false, error: "timeout" });
  const pdf = async () => new Response("%PDF", { status: 200, headers: { "content-type": "application/pdf" } });
  assert.equal((await scanUrl("example.com", pdf)).error, "not_html");
  const okFetch = async () => new Response(goodHtml, { status: 200, headers: { "content-type": "text/html" } });
  const result = await scanUrl("example.com", okFetch);
  assert.equal(result.ok, true);
  assert.equal(result.report.host, "example.com");
});
