-- CreateTable
CREATE TABLE "Message" (
    "ID" SERIAL NOT NULL,
    "chatID" INTEGER NOT NULL,
    "authorID" INTEGER NOT NULL,
    "contents" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("ID")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "Chat"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
