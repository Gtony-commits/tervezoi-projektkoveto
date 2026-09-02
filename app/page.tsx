import { NinaPlanner } from '@/components/nina-planner';
import { LoginGate } from '@/components/planner-addons';

export default function Home() {
  return (
    <LoginGate>
      <NinaPlanner />
    </LoginGate>
  );
}
