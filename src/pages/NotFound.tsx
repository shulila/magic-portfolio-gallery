
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">העמוד שחיפשת לא נמצא</p>
        <Button asChild>
          <Link to="/">חזרה לדף הבית</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
