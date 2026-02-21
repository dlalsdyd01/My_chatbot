import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, MessageSquare, Zap } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-bg-glow" />
      <div className="landing-content">
        <div className="landing-icon">
          <Sparkles size={36} />
        </div>

        <h1 className="landing-title">My</h1>
        <p className="landing-subtitle">
          문서를 업로드하고 AI와 대화하세요.<br />
          RAG 기반으로 문서 내용을 정확하게 분석합니다.
        </p>

        <div className="landing-features">
          <div className="landing-feature">
            <FileText size={16} />
            <span>PDF · TXT 문서 업로드</span>
          </div>
          <div className="landing-feature">
            <MessageSquare size={16} />
            <span>실시간 스트리밍 응답</span>
          </div>
          <div className="landing-feature">
            <Zap size={16} />
            <span>문서 기반 정확한 답변</span>
          </div>
        </div>

        <button className="landing-btn" onClick={() => navigate('/app')}>
          시작하기
        </button>
      </div>
    </div>
  );
}
