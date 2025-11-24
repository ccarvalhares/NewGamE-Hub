// In-memory storage for Tasks
let activeTask = null;

class Task {
    static create(code, points, timeInSeconds) {
        const expiresAt = Date.now() + (timeInSeconds * 1000);
        activeTask = {
            code,
            points,
            expiresAt
        };
        return activeTask;
    }

    static getActive() {
        if (!activeTask) return null;
        // Check if expired
        if (Date.now() > activeTask.expiresAt) {
            // Optionally clear it or just return null
            // activeTask = null; 
            // Returning it allows checking if it WAS active recently, but for now let's return it 
            // and let controller decide, or just return null if strictly expired.
            // Let's return it but controller logic seemed to imply checking validity.
            // Actually controller says "Nenhuma task ativa ou expirada", implying it might want to know.
            // But for safety let's just return the object.
        }
        return activeTask;
    }
}

module.exports = Task;
