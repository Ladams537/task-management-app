-- Create a table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for boards (e.g., "Project Phoenix", "Q4 Marketing")
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- If owner is deleted, the board remains but has no owner
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for lists/columns within a board (e.g., "To Do", "In Progress", "Done")
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE, -- If a board is deleted, its lists are deleted too
    position INTEGER NOT NULL -- To maintain the order of lists on the board
);

-- Create a table for tasks/cards
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE, -- If a list is deleted, its tasks are deleted too
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    position INTEGER NOT NULL, -- To maintain the order of tasks in a list
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a join table for board members to handle collaboration
CREATE TABLE board_members (
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'member', -- e.g., 'admin', 'member'
    PRIMARY KEY (board_id, user_id) -- Ensures a user can't be added to the same board twice
);

-- Create a table for notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link_url VARCHAR(255), -- Optional link to the relevant task/board
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comments to clarify the purpose of each table
COMMENT ON TABLE users IS 'Stores user account information.';
COMMENT ON TABLE boards IS 'Top-level containers for tasks, like a project board.';
COMMENT ON TABLE lists IS 'Columns on a board that contain tasks (e.g., To Do, In Progress).';
COMMENT ON TABLE tasks IS 'Individual task items or cards.';
COMMENT ON TABLE board_members IS 'Manages user permissions and access to boards.';
COMMENT ON TABLE notifications IS 'Stores notifications for users.';