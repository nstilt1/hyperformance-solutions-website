import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function BriefAbout() {
  const skills = [
    "Serverless",
    "APIs",
    "Prototyping",
    "Automation",
    "Rust",
    "Cryptography",
    "AWS",
    "Software testing",
    "Open Source",
  ];

  return (
    <section className="w-full max-w-3xl mx-auto py-20">
      <h2 className="text-3xl font-semibold tracking-tight text-center">About Hyperformance Solutions</h2>

        <p className="mt-4 text-lg text-muted-foreground text-center">
        I'm a one-man engineering studio dedicated to creating reliable and efficient serverless solutions. My focus is on:
        </p>
        <ul className="mt-4 list-disc list-inside pl-6 space-y-2 text-center">
        <li>Building scalable, production-ready systems from the ground up</li>
        <li>Ensuring end-to-end encryption and security in every solution</li>
        <li>Delivering fast, focused execution—from design to deployment</li>
        <li>Testing thoroughly before launch to minimize risk</li>
        </ul>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>

      <Separator className="mt-12" />
    </section>
  );
}
