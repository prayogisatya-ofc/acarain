import "../globals.css";
import NavbarAdmin from "@/lib/components/NavbarAdmin";

export default function PanelLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
        <div>
            <NavbarAdmin />
            <main className="py-8 px-4 mx-auto max-w-screen-xl">{children}</main>
        </div>
	);
}
