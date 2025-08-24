"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Label } from "./label";
import { Smartphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface PaymentMethodSelectorProps {
  onMethodSelect: (method: 'instamojo') => void;
  selectedMethod: 'instamojo';
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onMethodSelect,
  selectedMethod,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>
          Choose how you&apos;d like to pay for your order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select value={selectedMethod} onValueChange={(value) => onMethodSelect(value as 'instamojo')}>
            <SelectTrigger>
              <SelectValue placeholder="Select a payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instamojo">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Digital Payments (Instamojo)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
