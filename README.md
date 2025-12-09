Hi! This readme file provides details behind why the PPO algorithm is used over DQN for solving the taxi-v3 problem. 
I'll try my best to explain whatever i have learnt in my own words:
1) The DQN is value based - It maintains a q-table(how good it is to do an action at a state) - And then picks the best out of these to decide what the agent should do
  But the PPO is policy based - It learn how to act(probability of performing some action at some state).
Since the PPO chooses actions based on probabilities, it ends up exploring better and doesn't keep repeating the same mistake - which helps in taxi-v3 since we need to explore a lot of possibilities
2)PPO uses the clipping technique(basically stops the policy from changing too much in one update). This makes learning more stable and reliable.
Whereas in DQN sudden updates can cause it to become unstable and collapse learning
3)PPO learns long term behaviour better. The agent will get the big reward only after picking up and dropping passenger succesfully. PPO understands that certain actions have contributed to this state -
 so it doesnt just focus on immeadiate rewards

 This was what i understood :)
