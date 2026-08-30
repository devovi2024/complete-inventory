# Database Model Map

```mermaid
erDiagram
  USER ||--o{ AUDIT_LOG : creates
  CUSTOMER ||--o{ ORDER : places
  INVENTORY ||--o{ ORDER : supplies
  EMPLOYEE ||--o{ ATTENDANCE : records
  
  USER {
    ObjectId id
    string email
    string role
  }
  
  CUSTOMER {
    ObjectId id
    string name
    string type
  }
  
  INVENTORY {
    ObjectId id
    string product_name
    number total_qty
    number avg_cost
  }
  
  ORDER {
    ObjectId id
    ObjectId customer_id
    ObjectId product_id
    number cogs
    number profit
  }
  
  EMPLOYEE {
    ObjectId id
    string name
    string department
  }
  
  ATTENDANCE {
    ObjectId id
    ObjectId employee_id
    date status
  }
  
  AUDIT_LOG {
    ObjectId id
    ObjectId actor
    string action
    string entity
  }