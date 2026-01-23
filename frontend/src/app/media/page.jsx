"use client";

import { useMemo, useState } from "react";
import { postToApi } from "@/lib/post"; // your helper
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function guessExt(file) {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export default function MediaPage() {
    const [open, setOpen] = useState(false);

    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState("media/uploads");
    const [status, setStatus] = useState("");
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const canUpload = useMemo(() => !!file && !busy, [file, busy]);

    async function onUpload() {
        setBusy(true);
        setError("");
        setStatus("");
        setUploadedUrl("");

        try {
            if (!file) throw new Error("Pick a file first.");

            // Request a pre-signed PUT URL from your Rust Lambda
            // Your API should be behind JWT authorizer; postToApi sends Bearer token.
            const presignRes = await postToApi(
                process.env.NEXT_PUBLIC_API_BASE_URL + "/hf_presign",
                {
                    folder,
                    filename: sanitizeFilename(file.name),
                    contentType: file.type || "application/octet-stream",
                    // Optional: add a stable extension hint
                    ext: guessExt(file),
                }
            );

            const { uploadUrl, publicUrl } = await presignRes.json();

            if (!uploadUrl || !publicUrl) {
                throw new Error("Presign response missing uploadUrl/publicUrl.");
            }

            setStatus("Uploading to S3...");

            // Upload directly to S3 using the signed URL
            const put = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type || "application/octet-stream",
                },
                body: file,
            });

            if (!put.ok) {
                const text = await put.text().catch(() => "");
                throw new Error(`S3 upload failed: ${put.status} ${put.statusText}${text ? ` - ${text}` : ""}`);
            }

            setStatus("Upload complete.");
            setUploadedUrl(publicUrl);
        } catch (e) {
            setError(e?.message || String(e));
        } finally {
            setBusy(false);
        }
    }

    function reset() {
        setFile(null);
        setFolder("media/uploads");
        setStatus("");
        setUploadedUrl("");
        setError("");
        setBusy(false);
    }

    return (
        <div className="mx-auto max-w-3xl p-6 space-y-6">
            <h1 className="text-3xl font-semibold">Media</h1>

            <Dialog
                open={open}
                onOpenChange={(v) => {
                    setOpen(v);
                    if (!v) reset();
                }}
            >
                <DialogTrigger asChild>
                    <Button>Upload image</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Upload image</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Folder (S3 key prefix)</div>
                            <Input
                                value={folder}
                                onChange={(e) => setFolder(e.target.value)}
                                placeholder="media/products/my-product"
                                disabled={busy}
                            />
                            <div className="text-xs text-muted-foreground">
                                Example: <code>media/products/mofo-mojo</code>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">File</div>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                disabled={busy}
                            />
                            {file && (
                                <div className="text-xs text-muted-foreground">
                                    {file.name} ({Math.round(file.size / 1024)} KB)
                                </div>
                            )}
                        </div>

                        {status && (
                            <div className="rounded-md border p-3 text-sm">
                                {status}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-md border border-destructive p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {uploadedUrl && (
                            <div className="rounded-md border p-3 text-sm space-y-2">
                                <div className="font-medium">Uploaded URL</div>
                                <a className="underline break-all" href={uploadedUrl} target="_blank" rel="noreferrer">
                                    {uploadedUrl}
                                </a>
                                <img src={uploadedUrl} alt="Uploaded preview" className="mt-2 w-full rounded-md border" />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
                            Close
                        </Button>
                        <Button onClick={onUpload} disabled={!canUpload}>
                            {busy ? "Uploading..." : "Upload"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
