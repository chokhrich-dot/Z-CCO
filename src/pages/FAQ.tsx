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
        a: 'FHE is a revolutionary encryption technique that allows computations to be performed directly on encrypted data without ever decrypting it. This means your financial data remains private even while the credit score is being calculated. The result is also encrypted and can only be decrypted by authorized parties.',
      },
      {
        q: 'How does Zama\'s fhEVM work?',
        a: 'Zama\'s fhEVM is an Ethereum Virtual Machine that supports FHE operations. It allows smart contracts to perform computations on encrypted integers (euint32) while maintaining full privacy. The encryption keys are managed through a threshold network, ensuring no single party can decrypt the data.',
      },
      {
        q: 'Is my data really secure?',
        a: 'Yes. Your financial data (income, collateral, debt) is encrypted on your device before being submitted to the blockchain. The encrypted values cannot be read by anyone—not even the blockchain validators or other smart contracts. Only you and parties you explicitly authorize can access the computed credit score.',
      },
    ],
  },
  {
    category: 'Privacy Guarantees',
    icon: Shield,
    questions: [
      {
        q: 'Who can see my financial data?',
        a: 'No one can see your raw financial data once it\'s encrypted. The blockchain only stores encrypted values that appear as random data to anyone without the decryption key. Even lenders who request your credit score only see the tier (Poor, Fair, Good, Excellent)—never the underlying numbers.',
      },
      {
        q: 'What happens when a lender requests decryption?',
        a: 'When a lender requests decryption, a blockchain transaction is created that logs this request. You maintain control over who can decrypt your score. The decryption only reveals your credit tier classification, not your actual income, debt, or collateral values.',
      },
      {
        q: 'Can I revoke access to my data?',
        a: 'Yes. You have full control over your encrypted profile. You can update your data or manage access permissions at any time. All access requests are logged on-chain, providing full transparency about who has viewed your credit tier.',
      },
    ],
  },
  {
    category: 'How CCO Works',
    icon: Key,
    questions: [
      {
        q: 'How is my credit score calculated?',
        a: 'Your credit score is calculated using a formula that combines your encrypted income, collateral, and debt values. The computation happens entirely on encrypted data using FHE operations. The final result is categorized into one of four tiers: Poor, Fair, Good, or Excellent.',
      },
      {
        q: 'What data do I need to submit?',
        a: 'You need to submit three values: your monthly income, your collateral value, and your current debt—all in USD. These values are encrypted client-side before being sent to the smart contract. The encryption ensures that even if someone intercepts the transaction, they cannot read your data.',
      },
      {
        q: 'How long does the process take?',
        a: 'The encryption happens instantly on your device. Submitting the encrypted data to the blockchain typically takes 15-30 seconds depending on network conditions. Computing your credit score requires an additional transaction that usually completes within a minute.',
      },
    ],
  },
  {
    category: 'For Lenders',
    icon: Users,
    questions: [
      {
        q: 'How do I verify a borrower\'s creditworthiness?',
        a: 'As a lender, you can search for borrower profiles using their wallet address. If they have submitted an encrypted profile, you can request decryption of their credit tier. Once approved, you\'ll see their tier classification (Poor, Fair, Good, or Excellent).',
      },
      {
        q: 'Can I see the borrower\'s actual financial numbers?',
        a: 'No. The FHE encryption ensures that you only see the computed credit tier, never the raw financial data. This protects borrower privacy while still giving you meaningful information about their creditworthiness.',
      },
      {
        q: 'Are decryption requests logged?',
        a: 'Yes. Every decryption request creates an on-chain event (DecryptionRequested) that records your address and the borrower\'s address. This provides full transparency and auditability for all access to credit information.',
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
