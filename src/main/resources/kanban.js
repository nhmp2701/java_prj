// Danh sách các cột trạng thái trong Kanban Board
const STAGES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

async function loadKanbanBoard() {
    try {
        const response = await fetch('/api/v1/workflow-tasks');
        const result = await response.json();

        // Bóc tách dữ liệu từ wrapper ApiResponse
        const tasks = result.success ? result.data : (result.data || result);

        // Clear dữ liệu cũ nhưng giữ lại tiêu đề cột h2
        STAGES.forEach(stage => {
            const columnEl = document.getElementById(stage);
            if (columnEl) {
                columnEl.innerHTML = `<h2>${stage.replace('_', ' ')}</h2>`;
            }
        });

        // Render các tasks vào từng cột tương ứng
        tasks.forEach(task => {
            const columnEl = document.getElementById(task.status);
            if (columnEl) {
                const taskCard = createTaskCardElement(task); // Giả định hàm tạo card UI của bạn
                columnEl.appendChild(taskCard);
            }
        });

    } catch (error) {
        console.error("Error loading Kanban tasks:", error);
    }
}
// STAGES tương ứng với 4 trạng thái enum trong Backend
const STAGES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
let draggedCard = null;

// Hàm tạo giao diện cho từng thẻ Task (Đảm bảo có thuộc tính draggable)
function createTaskCardElement(task) {
    const card = document.createElement("div");
    card.className = "task";
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.dataset.taskStatus = task.status;
    card.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description || "Không có mô tả"}</p>
        <small>📌 ${task.assignedTo || "Chưa giao"}</small>
    `;

    card.addEventListener("dragstart", function(e) {
        draggedCard = this;
        this.style.opacity = "0.5";
        e.dataTransfer.effectAllowed = "move";
    });

    card.addEventListener("dragend", function() {
        this.style.opacity = "1";
    });

    return card;
}

// Thiết lập vùng nhận thẻ khi thả (Drop Zones)
function setupDropZones() {
    STAGES.forEach((stage) => {
        const columnEl = document.getElementById(stage);
        if (columnEl) {
            columnEl.addEventListener("dragover", function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                this.style.backgroundColor = "#e0e0e0"; // Hiệu ứng hover cột
            });

            columnEl.addEventListener("dragleave", function() {
                this.style.backgroundColor = ""; // Trả lại màu nền cũ
            });

            columnEl.addEventListener("drop", async function(e) {
                e.preventDefault();
                this.style.backgroundColor = "";

                if (draggedCard) {
                    const taskId = draggedCard.dataset.taskId;
                    const oldStatus = draggedCard.dataset.taskStatus;
                    const newStatus = stage;

                    if (oldStatus !== newStatus) {
                        try {
                            // Gọi chính xác API cập nhật trạng thái đã viết ở Backend
                            const response = await fetch(`/api/tasks/${taskId}/status?status=${newStatus}`, {
                                method: "PUT"
                            });
                            const result = await response.json();

                            if (result.success) {
                                this.appendChild(draggedCard);
                                draggedCard.dataset.taskStatus = newStatus;
                            } else {
                                alert("Lỗi cập nhật: " + result.message);
                            }
                        } catch (error) {
                            console.error("Error:", error);
                            alert("Lỗi kết nối đến server Backend");
                        }
                    }
                }
            });
        }
    });
}

// Kích hoạt khi trang tải xong
document.addEventListener("DOMContentLoaded", setupDropZones);