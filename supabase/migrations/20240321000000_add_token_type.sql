-- Add token_type column to user_nfts table
ALTER TABLE user_nfts
ADD COLUMN token_type text NOT NULL DEFAULT 'soulbound'
CHECK (token_type IN ('soulbound', 'erc1155')); 