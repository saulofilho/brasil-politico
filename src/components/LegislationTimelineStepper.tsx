import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  UserCheck, 
  Building2, 
  Award,
  Vote,
  Sparkles,
  Info
} from 'lucide-react';
import { Legislation, LegislationTimelineStep } from '../types';

interface LegislationTimelineStepperProps {
  law: Legislation;
  initialStepIndex?: number;
  compact?: boolean;
}

export const LegislationTimelineStepper: React.FC<LegislationTimelineStepperProps> = ({
  law,
  initialStepIndex,
  compact = false
}) => {
  const steps = law.timeline || [];

  // Default to the current step (or the last completed step if none current)
  const defaultIndex = () => {
    if (initialStepIndex !== undefined && initialStepIndex >= 0 && initialStepIndex < steps.length) {
      return initialStepIndex;
    }
    const currentIdx = steps.findIndex(s => s.status === 'current');
    if (currentIdx !== -1) return currentIdx;
    const lastCompleted = steps.map(s => s.status).lastIndexOf('completed');
    if (lastCompleted !== -1) return lastCompleted;
    return 0;
  };

  const [activeStepIndex, setActiveStepIndex] = useState<number>(defaultIndex);

  if (steps.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs text-slate-500">
        <Clock className="h-4 w-4 mx-auto mb-1 text-slate-400" />
        <span>Histórico de tramitação em fase de digitalização oficial.</span>
      </div>
    );
  }

  const activeStep: LegislationTimelineStep = steps[activeStepIndex] || steps[0];
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const getChamberBadgeColor = (chamber: string) => {
    switch (chamber) {
      case 'Câmara dos Deputados':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Senado Federal':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Congresso Nacional':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Presidência da República':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'STF':
        return 'bg-indigo-50 text-indigo-900 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
      
      {/* Header & Progress Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            <Building2 className="h-3.5 w-3.5 text-emerald-700" />
            <span>Linha do Tempo Legislativa • Tramitação Passo a Passo</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 mt-0.5">
            {law.code}: {law.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500">
              Etapas: <strong className="text-slate-800">{completedCount}/{steps.length}</strong> ({progressPercent}%)
            </div>
            <div className="w-24 sm:w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5 border border-slate-200">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase whitespace-nowrap ${
            law.status === 'Sancionado' || law.status === 'Aprovado'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            {law.status}
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Stepper */}
      <div className="relative overflow-x-auto pb-2 pt-1 scrollbar-thin">
        <div className="flex items-center min-w-[580px] sm:min-w-full justify-between gap-1 px-1">
          {steps.map((step, index) => {
            const isSelected = activeStepIndex === index;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <React.Fragment key={step.id}>
                {/* Step Node */}
                <button
                  id={`stepper-node-${step.id}`}
                  onClick={() => setActiveStepIndex(index)}
                  className={`flex flex-col items-center flex-1 max-w-[130px] p-1.5 rounded-lg text-center transition-all cursor-pointer group focus:outline-none ${
                    isSelected 
                      ? 'bg-emerald-50/80 border border-emerald-400 shadow-xs ring-1 ring-emerald-300' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                  title={`Etapa ${step.stageNumber}: ${step.stageName}`}
                >
                  {/* Circle Icon Indicator */}
                  <div className="relative mb-1">
                    {isCompleted ? (
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected 
                          ? 'bg-emerald-700 text-white ring-2 ring-emerald-300' 
                          : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200'
                      }`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    ) : isCurrent ? (
                      <div className="relative">
                        <span className="absolute -inset-0.5 rounded-full bg-amber-400 animate-ping opacity-60" />
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs relative ${
                          isSelected 
                            ? 'bg-amber-600 text-white ring-2 ring-amber-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          <Clock className="h-3.5 w-3.5 animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-[10px] border transition-colors ${
                        isSelected
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-100 text-slate-400 border-slate-200 group-hover:border-slate-300'
                      }`}>
                        {step.stageNumber}
                      </div>
                    )}
                  </div>

                  {/* Stage Label & Date */}
                  <span className={`text-[10px] font-bold line-clamp-1 leading-tight ${
                    isSelected ? 'text-emerald-900' : isCompleted ? 'text-slate-800' : isCurrent ? 'text-amber-900' : 'text-slate-400'
                  }`}>
                    {step.stageName}
                  </span>

                  <span className="text-[9px] font-mono text-slate-400 mt-0.5 truncate max-w-full">
                    {step.date.split(' - ')[0]}
                  </span>
                </button>

                {/* Connecting Line between steps */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 min-w-[12px] max-w-[32px] mx-0.5 rounded-full self-center mb-5 overflow-hidden bg-slate-200">
                    <div 
                      className={`h-full transition-all ${
                        isCompleted ? 'bg-emerald-600' : isCurrent ? 'bg-amber-400' : 'bg-slate-200'
                      }`} 
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Detailed Stage Breakdown Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold font-mono bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded">
                Etapa {activeStep.stageNumber} de {steps.length}
              </span>
              
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${getChamberBadgeColor(activeStep.chamberOrBody)}`}>
                {activeStep.chamberOrBody}
              </span>

              <span className={`text-[10px] font-bold px-2 py-0.2 rounded border uppercase font-mono ${
                activeStep.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : activeStep.status === 'current'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                  : 'bg-slate-200 text-slate-600 border-slate-300'
              }`}>
                {activeStep.status === 'completed' ? '✓ Concluído' : activeStep.status === 'current' ? '⏳ Em Andamento Atual' : 'Próxima Etapa'}
              </span>
            </div>

            <h5 className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-emerald-700" />
              {activeStep.stageName}
            </h5>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
              📅 {activeStep.date}
            </span>
          </div>
        </div>

        {/* Stage Summary Narrative */}
        <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
          {activeStep.summary}
        </p>

        {/* Milestone or Doc Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {activeStep.keyMilestone && (
            <div className="bg-emerald-50/70 border border-emerald-200 p-2 rounded-lg text-emerald-950 flex items-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[10px] uppercase font-bold block text-emerald-800">Marco Decisivo</strong>
                <span className="text-[11px]">{activeStep.keyMilestone}</span>
              </div>
            </div>
          )}

          {activeStep.reporter && (
            <div className="bg-slate-100/80 border border-slate-200 p-2 rounded-lg text-slate-800 flex items-start gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[10px] uppercase font-bold block text-slate-600">Relatoria / Autoria</strong>
                <span className="text-[11px] font-medium">{activeStep.reporter}</span>
              </div>
            </div>
          )}
        </div>

        {/* Voting Results Widget if votes took place */}
        {activeStep.voteResult && (
          <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                <Vote className="h-3.5 w-3.5 text-emerald-700" />
                Resultado da Votação em Colegiado
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activeStep.voteResult.approved 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {activeStep.voteResult.approved ? 'Aprovado' : 'Rejeitado'}
              </span>
            </div>

            {/* Vote Bar */}
            {(() => {
              const favor = activeStep.voteResult.favor;
              const contra = activeStep.voteResult.contra;
              const total = favor + contra + (activeStep.voteResult.abstencoes || 0);
              const favorPct = total > 0 ? Math.round((favor / total) * 100) : 100;
              const contraPct = total > 0 ? Math.round((contra / total) * 100) : 0;

              return (
                <div className="space-y-1">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                    <div 
                      style={{ width: `${favorPct}%` }}
                      className="bg-emerald-600 transition-all"
                      title={`A Favor: ${favor}`}
                    />
                    <div 
                      style={{ width: `${contraPct}%` }}
                      className="bg-rose-600 transition-all"
                      title={`Contra: ${contra}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span className="text-emerald-800 font-bold">
                      ✓ A Favor: {favor} ({favorPct}%)
                    </span>
                    {activeStep.voteResult.abstencoes !== undefined && activeStep.voteResult.abstencoes > 0 && (
                      <span className="text-slate-500">
                        Abstenções: {activeStep.voteResult.abstencoes}
                      </span>
                    )}
                    <span className="text-rose-800 font-bold">
                      ✗ Contra: {contra} ({contraPct}%)
                    </span>
                  </div>

                  {activeStep.voteResult.quorumRequired && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5">
                      <Info className="h-3 w-3 text-slate-400" />
                      <span>Quórum Exigido: <strong>{activeStep.voteResult.quorumRequired}</strong></span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Footer Navigation within Stepper */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200">
          <button
            id="stepper-btn-prev"
            onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
            disabled={activeStepIndex === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Etapa Anterior</span>
          </button>

          {/* Jump to current button */}
          {steps.some(s => s.status === 'current') && (
            <button
              onClick={() => {
                const cIdx = steps.findIndex(s => s.status === 'current');
                if (cIdx !== -1) setActiveStepIndex(cIdx);
              }}
              className="text-[11px] text-amber-900 hover:underline font-bold"
            >
              Ir para Etapa Atual
            </button>
          )}

          <button
            id="stepper-btn-next"
            onClick={() => setActiveStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStepIndex === steps.length - 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 transition-colors cursor-pointer"
          >
            <span>Próxima Etapa</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
