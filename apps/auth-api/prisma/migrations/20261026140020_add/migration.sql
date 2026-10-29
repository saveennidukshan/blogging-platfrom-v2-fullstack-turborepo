-- CreateTable
CREATE TABLE "auth_outbox" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isSended" BOOLEAN NOT NULL,

    CONSTRAINT "auth_outbox_pkey" PRIMARY KEY ("id")
);
