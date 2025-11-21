import { createServer } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    routes() {
      this.namespace = "api";

      // GET all employees
      this.get("/employees", (schema) => {
        return {
          employees: [
            // Leadership Team
            { id: 1, name: "Mark Hill", designation: "CEO", team: "Leadership", managerId: null, avatar: "https://i.pravatar.cc/150?img=12" },
            { id: 2, name: "Joe Linux", designation: "CTO", team: "Leadership", managerId: 1, avatar: "https://i.pravatar.cc/150?img=13" },
            { id: 3, name: "John Green", designation: "CFO", team: "Leadership", managerId: 1, avatar: "https://i.pravatar.cc/150?img=33" },
            
            // Engineering Team
            { id: 4, name: "Ron Blomquist", designation: "Senior Engineer", team: "Engineering", managerId: 2, avatar: "https://i.pravatar.cc/150?img=15" },
            { id: 5, name: "Sarah Chen", designation: "Engineering Manager", team: "Engineering", managerId: 2, avatar: "https://i.pravatar.cc/150?img=5" },
            { id: 6, name: "Mike Torres", designation: "Software Engineer", team: "Engineering", managerId: 5, avatar: "https://i.pravatar.cc/150?img=17" },
            { id: 7, name: "Emily Watson", designation: "Software Engineer", team: "Engineering", managerId: 5, avatar: "https://i.pravatar.cc/150?img=9" },
            { id: 8, name: "David Kim", designation: "QA Engineer", team: "Engineering", managerId: 4, avatar: "https://i.pravatar.cc/150?img=52" },
            
            // Finance Team
            { id: 9, name: "Lisa Anderson", designation: "Finance Manager", team: "Finance", managerId: 3, avatar: "https://i.pravatar.cc/150?img=10" },
            { id: 10, name: "Robert Taylor", designation: "Accountant", team: "Finance", managerId: 9, avatar: "https://i.pravatar.cc/150?img=53" },
            { id: 11, name: "Jennifer Brown", designation: "Financial Analyst", team: "Finance", managerId: 9, avatar: "https://i.pravatar.cc/150?img=29" },
            
            // Marketing Team
            { id: 12, name: "Amanda White", designation: "Marketing Director", team: "Marketing", managerId: 1, avatar: "https://i.pravatar.cc/150?img=20" },
            { id: 13, name: "Chris Martinez", designation: "Content Manager", team: "Marketing", managerId: 12, avatar: "https://i.pravatar.cc/150?img=51" },
            { id: 14, name: "Nicole Johnson", designation: "Social Media Specialist", team: "Marketing", managerId: 12, avatar: "https://i.pravatar.cc/150?img=32" },
            
            // HR Team
            { id: 15, name: "Patricia Davis", designation: "HR Manager", team: "HR", managerId: 1, avatar: "https://i.pravatar.cc/150?img=44" },
            { id: 16, name: "Kevin Lee", designation: "HR Specialist", team: "HR", managerId: 15, avatar: "https://i.pravatar.cc/150?img=60" },
            { id: 17, name: "Rachel Moore", designation: "Recruiter", team: "HR", managerId: 15, avatar: "https://i.pravatar.cc/150?img=23" },
          ]
        };
      });

      // UPDATE employee (change manager)
      this.patch("/employees/:id", (schema, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        
        // In a real implementation, you'd update the database here
        // For now, we'll just return success
        return {
          employee: {
            id: parseInt(id),
            ...attrs
          }
        };
      });
    },
  });

  return server;
}