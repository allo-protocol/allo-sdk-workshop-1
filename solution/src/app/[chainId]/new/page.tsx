"use client";

import PoolForm from "@/components/pool/PoolForm";
import Container from "@/components/shared/Container";
import { NewPoolContextProvider } from "@/context/NewPoolContext";

const newPool = () => {
  return (
    <Container>
      <NewPoolContextProvider>
        <PoolForm />
      </NewPoolContextProvider>
    </Container>
  );
};

export default newPool;
