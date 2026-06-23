# Notification System Design

# Stage 1

## Notification System API Design

### Overview

The notification platform supports:

1. Create Notification
2. Get Notifications
3. Get Notification By ID
4. Mark Notification As Read
5. Mark All Notifications As Read
6. Delete Notification
7. Get Unread Count
8. Real-Time Notifications

---

## Common Headers

### Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
```

### Success Response Format

```json
{
  "success": true,
  "data": {}
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

# 1. Create Notification

### Endpoint

```http
POST /api/v1/notifications
```

### Request Body

```json
{
  "studentId": 1042,
  "type": "Placement",
  "message": "CSX Corporation hiring drive"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "notificationId": "d146095a-0d86-4a34-9e69-3900a14576bc"
  }
}
```

---

# 2. Get Notifications

### Endpoint

```http
GET /api/v1/notifications
```

### Query Parameters

```http
?page=1
&limit=20
&notification_type=Placement
```

### Response

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
        "studentId": 1042,
        "type": "Placement",
        "message": "CSX Corporation hiring drive",
        "isRead": false,
        "createdAt": "2026-04-22T17:51:30Z"
      }
    ]
  }
}
```

---

# 3. Get Notification By ID

### Endpoint

```http
GET /api/v1/notifications/{notificationId}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
    "type": "Placement",
    "message": "CSX Corporation hiring drive",
    "isRead": false,
    "createdAt": "2026-04-22T17:51:30Z"
  }
}
```

---

# 4. Mark Notification As Read

### Endpoint

```http
PATCH /api/v1/notifications/{notificationId}/read
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 5. Mark All Notifications As Read

### Endpoint

```http
PATCH /api/v1/notifications/read-all
```

### Request

```json
{
  "studentId": 1042
}
```

### Response

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

# 6. Delete Notification

### Endpoint

```http
DELETE /api/v1/notifications/{notificationId}
```

### Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

# 7. Get Unread Count

### Endpoint

```http
GET /api/v1/notifications/unread-count?studentId=1042
```

### Response

```json
{
  "success": true,
  "data": {
    "unreadCount": 12
  }
}
```

---

# Real-Time Notification Mechanism

### Technology Choice

WebSockets

### Reason

* Real-time delivery
* Low latency
* Bi-directional communication
* Reduced polling overhead
* Scales well for notification workloads

### WebSocket Event

Event Name:

```text
NEW_NOTIFICATION
```

Payload:

```json
{
  "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
  "type": "Placement",
  "message": "CSX Corporation hiring drive",
  "createdAt": "2026-04-22T17:51:30Z"
}
```

### Client Behaviour

1. Client establishes WebSocket connection after login.
2. Server pushes new notifications immediately.
3. UI updates unread count and notification list in real-time.
4. If connection drops, automatic reconnection is attempted.



# Stage 2

### Database Choice

I would use PostgreSQL as the persistent storage because:

* ACID compliance
* Strong indexing support
* Reliable transactions
* Scalability through partitioning
* Good support for analytical queries

### Schema

```sql
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE
);

CREATE TYPE notification_type AS ENUM (
    'Event',
    'Result',
    'Placement'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    notification_type notification_type,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Scaling Challenges

As notification volume increases:

* Full table scans become expensive
* Read latency increases
* Sorting becomes slower
* Storage size grows significantly

### Solutions

* Indexing
* Table partitioning by date
* Read replicas
* Redis caching
* Pagination

### Queries

Unread Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = $1
AND is_read = FALSE
ORDER BY created_at DESC;
```

Mark Notification Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = $1;
```

Unread Count

```sql
SELECT COUNT(*)
FROM notifications
WHERE student_id = $1
AND is_read = FALSE;
```



# Stage 3

### Is the Query Accurate?

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

Yes, it returns unread notifications for a student.

### Why is it Slow?

With:

* 50,000 students
* 5,000,000 notifications

The database may perform a full table scan if indexes are missing.

Sorting large result sets also increases cost.

### Better Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(
    student_id,
    is_read,
    created_at DESC
);
```

### Optimized Query

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at DESC;
```

### Cost

Without Index:

O(N)

With Composite Index:

O(log N)

### Should We Index Every Column?

No.

Problems:

* Increased storage
* Slower inserts
* Slower updates
* Higher maintenance cost

Indexes should be created only on frequently queried columns.

### Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE notification_type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days';
```


# Stage 4

### Problem

Notifications are fetched on every page load.

This overloads the database.

### Solutions

#### Redis Cache

Store frequently accessed notifications.

Advantages:

* Extremely fast reads
* Reduced DB load

Tradeoff:

* Cache invalidation complexity

#### Pagination

Fetch notifications in pages.

Advantages:

* Reduced response size
* Lower DB pressure

Tradeoff:

* More API calls

#### WebSockets

Push notifications instead of polling.

Advantages:

* Real-time updates
* Fewer requests

Tradeoff:

* Persistent connections required

#### Read Replicas

Use replicas for read-heavy workloads.

Advantages:

* Increased scalability

Tradeoff:

* Replication lag


# Stage 5

### Problems in Existing Design

```python
for student in students:
    send_email()
    save_to_db()
    push_to_app()
```

Issues:

* Sequential processing
* Slow execution
* Failure stops progress
* No retry support

### If 200 Emails Fail?

Need:

* Retry mechanism
* Dead Letter Queue
* Failure logging

### Should Email and DB Save Happen Together?

No.

Database write should happen first.

Email delivery should be asynchronous.

### Improved Architecture

1. Save notification in database
2. Publish notification event
3. Queue workers process:

   * Email
   * Push Notification
4. Retry failures

### Revised Pseudocode

```python
function notify_all(student_ids, message):

    notification_id = save_notification(message)

    for student_id in student_ids:

        queue.publish({
            "student_id": student_id,
            "notification_id": notification_id
        })

worker():

    while true:

        job = queue.consume()

        try:
            send_email(job.student_id)
            push_to_app(job.student_id)

        except:
            retry(job)
```


# Stage 6

Priority is calculated using:

Placement = 3
Result = 2
Event = 1

Score Formula:

Priority Score =
(Type Weight × 1000000)
+ Timestamp

Notifications are sorted in descending order.

Top N notifications are displayed.

To efficiently maintain Top N when new notifications arrive, a Min Heap of size N can be maintained. When a new notification arrives, compare its score with the root. Replace root only if the new notification has higher priority. This ensures O(log N) insertion while keeping only N highest-priority notifications.
