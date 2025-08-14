import heapq
import sys

def solve_maze(n, t, endpoint1, endpoint2, edgeLength):
    adj = [[] for _ in range(n + 1)]
    for i in range(len(endpoint1)):
        u, v, w = endpoint1[i], endpoint2[i], edgeLength[i]
        adj[u].append((v, w))
        adj[v].append((u, w))

    arrival_times = [float('inf')] * (n + 1)

    start_vertex = 1
    start_time = 0

    start_disappearance_time = t[start_vertex - 1]
    if start_disappearance_time != -1 and start_time >= start_disappearance_time:
        return [-1] * n

    arrival_times[start_vertex] = start_time

    pq = [(start_time, start_vertex)]

    while pq:
        current_time, u = heapq.heappop(pq)

        if current_time > arrival_times[u]:
            continue

        for v, weight in adj[u]:
            new_time = current_time + weight

            disappearance_time_v = t[v - 1]

            can_visit = (disappearance_time_v == -1) or (new_time < disappearance_time_v)

            if new_time < arrival_times[v] and can_visit:
                arrival_times[v] = new_time
                heapq.heappush(pq, (new_time, v))

    result = []
    for i in range(1, n + 1):
        if arrival_times[i] == float('inf'):
            result.append(-1)
        else:
            result.append(arrival_times[i])

    return result

# --- Example Usage based on Sample Case 0 ---
n0 = 4
t0 = [1, 2, 7, 9]
endpoint1_0 = [1, 2, 3, 4]
endpoint2_0 = [2, 4, 1, 3]
edgeLength_0 = [2, 1, 5, 3]

print(f"Sample Case 0 Input:")
print(f"n = {n0}, t = {t0}")
print(f"Edges: {list(zip(endpoint1_0, endpoint2_0, edgeLength_0))}")
print(f"Sample Output 0: {solve_maze(n0, t0, endpoint1_0, endpoint2_0, edgeLength_0)}")
# Expected Output: [0, -1, 4, 6]

print("-" * 20)

# --- Example Usage based on Sample Case 1 ---
n1 = 3
t1 = [10, 3, 7]
endpoint1_1 = [1, 1, 2]
endpoint2_1 = [2, 3, 3]
edgeLength_1 = [3, 9, 1]

print(f"Sample Case 1 Input:")
print(f"n = {n1}, t = {t1}")
print(f"Edges: {list(zip(endpoint1_1, endpoint2_1, edgeLength_1))}")
print(f"Sample Output 1: {solve_maze(n1, t1, endpoint1_1, endpoint2_1, edgeLength_1)}")
# Expected Output: [0, -1, -1]