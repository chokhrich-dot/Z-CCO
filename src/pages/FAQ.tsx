import { motion } from 'framer-motion';
import { HelpCircle, Shield, Lock, Key, Users, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    category: 'FHE Encryption',
    icon: Lock,
    questions: [
      {
        q: 'What is Fully Homomorphic Encryption (FHE)?',
        a: 'FHE is a revolutionary encryption technique that allows computations to be performed directly on encrypted data without ever decrypting it. This means your financial data remains private even while the credit score is being calculated.',
      },
      {
        q: "How does Zama's fhEVM work?",
        a: "Zama's fhEVM is an Ethereum Virtual Machine that supports FHE operations. It allows smart contracts to perform computations on encrypted integers (euint32) while maintaining full privacy.",
      },
      {
        q: 'Is my data really secure?',
        a: 'Yes. Your financial data is encrypted on your device before being submitted to the blockchain. The encrypted values cannot be read by anyone—not even the blockchain validators.',
      },
    ],
  },
  {
    category: 'Relayer SDK & Gateway',
    icon: Key,
    questions: [
      {
        q: 'What is the Relayer SDK?',
        a: 'The Relayer SDK facilitates secure communication between the DApp and the Zama Gateway, handling encrypted data exchanges and decryption requests without requiring users to interact directly with the Gateway Chain.',
      },
      {
        q: 'How does the Gateway process decryption?',
        a: 'When a lender requests decryption, the Relayer forwards the request to Zama Gateway. The Gateway processes the FHE decryption using threshold cryptography and returns only the credit tier—never your raw financial data.',
      },
      {
        q: 'Is the Relayer communication secure?',
        a: 'Yes. All communication is cryptographically signed and verified. The Relayer cannot see or modify your encrypted data—it only facilitates the secure transfer of encrypted payloads.',
      },
    ],
  },
  {
    category: 'Access Control (ACL)',
    icon: Users,
    questions: [
      {
        q: 'How do I control who sees my credit tier?',
        a: 'CCO uses an Access Control List (ACL) system. You can grant or revoke access to specific lender addresses from your Profile page. Only authorized lenders can request decryption.',
      },
      {
        q: 'Can I set expiring permissions?',
        a: 'Yes. When granting access, you can optionally set an expiry date. After expiration, the lender must request access again. This gives you fine-grained control over your data.',
      },
      {
        q: 'Are access requests logged on-chain?',
        a: 'Yes. Every decryption request creates an on-chain event (DecryptionRequested) that records the lender and borrower addresses, providing full transparency and auditability.',
      },
    ],
  },
  {
    category: 'Privacy Guarantees',
    icon: Shield,
    questions: [
      {
        q: 'Who can see my financial data?',
        a: "No one can see your raw financial data. The blockchain only stores encrypted values. Even authorized lenders only see your credit tier (Poor, Fair, Good, Excellent)—never the underlying numbers.",
      },
      {
        q: 'What happens when a lender requests decryption?',
        a: 'The request goes through the Relayer to the Gateway. If you have granted that lender access via ACL, the Gateway decrypts only your credit tier classification and returns it.',
      },
      {
        q: 'Can I revoke access to my data?',
        a: 'Yes. You have full control via the Profile page. Revoke any permission instantly. All access changes are logged on-chain for transparency.',
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <Header />

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Learn about FHE encryption, privacy guarantees, and how CCO works
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqItems.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <Card className="bg-card border-border overflow-hidden">
                  <CardHeader className="bg-secondary/30">
                    <CardTitle className="flex items-center gap-3 text-foreground">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-primary" />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.category}-${index}`}
                          className="border-border"
                        >
                          <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-4">
                            <span className="pr-4">{item.q}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Still have questions?
                    </h3>
                    <p className="text-muted-foreground">
                      The CCO protocol is built on Zama's cutting-edge FHE technology. 
                      For technical documentation and deeper dives into the cryptography, 
                      visit the Zama documentation or explore the smart contract on Sepolia.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href="https://docs.zama.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Zama Docs
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
