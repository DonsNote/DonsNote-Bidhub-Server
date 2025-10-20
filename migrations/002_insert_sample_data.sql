-- 샘플 사용자 생성 (비밀번호는 실제로는 해시되어야 함)
INSERT INTO users (email, username, password_hash, full_name) VALUES
('seller1@example.com', 'seller1', '$2a$10$placeholder', 'John Doe'),
('seller2@example.com', 'seller2', '$2a$10$placeholder', 'Jane Smith'),
('bidder1@example.com', 'bidder1', '$2a$10$placeholder', 'Mike Johnson'),
('bidder2@example.com', 'bidder2', '$2a$10$placeholder', 'Sarah Williams')
ON CONFLICT (email) DO NOTHING;

-- 샘플 경매 데이터 삽입
INSERT INTO auctions (title, description, starting_bid, current_bid, image_src, category, end_date, seller_id, status) VALUES
('Modern Living Room Set', 'Beautiful modern furniture set', 800, 1200, '/images/item-1.png', 'Furniture', NOW() + INTERVAL '11 days', 1, 'active'),
('Classic 1967 Mustang', 'Vintage car in excellent condition', 20000, 25000, '/images/item-2.png', 'Vehicles', NOW() + INTERVAL '15 days', 1, 'active'),
('Elegant Diamond Ring', '2 carat diamond ring', 4000, 5000, '/images/item-3.png', 'Jewelry', NOW() + INTERVAL '13 days', 2, 'active'),
('Contemporary Abstract Painting', 'Original artwork by local artist', 500, 800, '/images/item-4.png', 'Art', NOW() + INTERVAL '12 days', 2, 'active'),
('Antique Pocket Watch', 'Rare 19th century pocket watch', 200, 350, '/images/item-5.png', 'Collectibles', NOW() + INTERVAL '1 days', 1, 'active'),
('Designer Handbag', 'Authentic designer handbag', 500, 700, '/images/item-6.png', 'Fashion', NOW() + INTERVAL '2 days', 2, 'active'),
('Signed Baseball', 'Baseball signed by famous player', 100, 150, '/images/item-7.png', 'Sports', NOW() + INTERVAL '0.5 days', 1, 'active'),
('Vintage Camera', 'Collectible film camera', 150, 200, '/images/item-8.png', 'Electronics', NOW() + INTERVAL '3 days', 2, 'active')
ON CONFLICT DO NOTHING;
