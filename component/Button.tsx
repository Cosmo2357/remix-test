// make button component 
import { Link } from "@remix-run/react";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  to: string;
}

export default function Button({ children, to }: ButtonProps) {
  return (
    <Link to={to} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {children}
    </Link>
  );
}