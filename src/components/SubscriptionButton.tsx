"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";

type Props = { isPro: boolean };

const SubscriptionButton = (props: Props) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error during subscription:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Button disabled={loading} onClick={handleSubscription} variant="outline"
    className="w-full bg-transparent border text-white border-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all duration-300 py-2">
      {props.isPro ? "Gerenciar Assinatura" : "Upgrade Assinatura"}
    </Button>
  );
};

export default SubscriptionButton;
