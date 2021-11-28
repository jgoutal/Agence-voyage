import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      "Content-type": "application/json"
    }
  });

class BilletDataService {
  getAll() {
    return http.get("/billets");
  }

  get(id) {
    return http.get(`/billets/${id}`);
  }

  create(data) {
    return http.post("/billets", data);
  }

  update(id, data) {
    return http.put(`/billets/${id}`, data);
  }

  delete(id) {
    return http.delete(`/billets/${id}`);
  }

  deleteAll() {
    return http.delete(`/billets`);
  }

  findByArrival(VilleArrivee) {
    return http.get(`/billets?ville=${VilleArrivee}`);
  }

}

export default new BilletDataService();