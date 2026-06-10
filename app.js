/* ==========================================================================
   Academic Argument Coach - Frontend Script (app.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements - Views
    const inputView = document.getElementById("input-view");
    const reportView = document.getElementById("report-view");
    
    // DOM Elements - Editor
    const essayInput = document.getElementById("essay-input");
    const btnAnalyze = document.getElementById("btn-analyze");
    const analyzeSpinner = document.getElementById("analyze-spinner");
    const charCountWithSpaceEl = document.getElementById("char-count-with-space");
    const charCountNoSpaceEl = document.getElementById("char-count-no-space");
    
    const btnLoadAi = document.getElementById("btn-load-ai");
    const btnLoadStudent = document.getElementById("btn-load-student");
    const btnLoadRandomStudent = document.getElementById("btn-load-random-student");
    const btnBackToInput = document.getElementById("btn-back-to-input");
    const btnBackToInputLarge = document.getElementById("btn-back-to-input-large"); // 하단 대형 수정 버튼
    const btnBackToInputTop = document.getElementById("btn-back-to-input-top"); // 상단 왼쪽 둥근 복귀 버튼

    // DOM Elements - Modal Pop-Up
    const modal = document.getElementById("example-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalEssayText = document.getElementById("modal-essay-text");
    const modalMetricStd = document.getElementById("modal-metric-std");
    const modalMetricTtr = document.getElementById("modal-metric-ttr");
    const modalExplanationText = document.getElementById("modal-explanation-text");
    
    const btnModalClose = document.getElementById("btn-modal-close");
    const btnModalX = document.getElementById("btn-modal-x");
    const btnModalLoad = document.getElementById("btn-modal-load");
    const btnPrintReport = document.getElementById("btn-print-report");
    
    // Track current modal example key
    let currentExampleKey = null;

    // 1. 예시 데이터 정의 (이모티콘 없이 명세서 규격 동기화)
    const EXAMPLES = {
        ai: {
            text: `현대 사회에 있어서 인공지능의 발전은 급속도로 진행되고 있다. 우리는 반드시 인공지능 혁신을 수용해야 할 필요가 있다. 인공지능 기술은 전 세계 of 비즈니스 분야에 도입되어 생산성을 가짐에 틀림없다. 그것은 매우 효율적이며 무조건 성공을 보장할 수 있다. 인공지능이 인간의 일자리를 대체하는 문제에 있어서는 여러 갈등이 나타날 것으로 보인다. 그러나 기술은 절대 멈추지 않는다. 

첫째, 교육 분야에 있어서 인공지능은 새로운 패러다임을 연다. 둘째, 의료 분야에 있어서 인공지능은 질병을 정복한다. 셋째, 제조 분야에 있어서 인공지능은 속도를 극대화한다. 따라서 인간은 이에 적응해야만 한다. 이러한 분석은 모든 전문가들에 의해 행해진다. 우리는 결코 이러한 흐름을 거부해서는 안 된다.`,
            metrics: { std: "문장 호흡: 일정하고 단조로움", ttr: "단어 배치: 인위적인 단순 나열" },
            title: "보완이 필요한 논증문 예시",
            coaching: `
                <p><strong>💡 코칭 진단 요약: 기계적인 문맥 흐름 및 정형화된 주장 패턴 감지</strong></p>
                <p>이 초안은 글쓴이 고유의 호흡이나 질문 던지기 없이 지나치게 도식적이고 획일적인 인위적 에세이의 한계를 보여줍니다.</p>
                <ul>
                    <li><strong>일정하고 단조로운 문장 호흡</strong>: 어휘가 인위적으로 나열되어 있고 문장의 호흡이 일정하여 전체적으로 기계적인 느낌을 줍니다. 문장의 길이에 변화가 없어 독자가 리듬감을 느끼지 못하고 쉽게 지루해집니다.</li>
                    <li><strong>인위적인 사전식 단어 배치</strong>: 문맥 속에서 핵심 주제어가 자연스럽게 반복되며 강조되는 대신, 기계적이고 사전식으로 다채로운 낱단어만 인위적으로 채워 넣은 듯한 부자연스러움이 드러납니다.</li>
                    <li><strong>극단적이고 독단적인 표현 남용</strong>: 공적인 글임에도 '반드시', '무조건', '절대', '결코' 등의 극단적인 부사를 빈번히 사용하여, 반론이나 예외의 가능성을 차단하고 논리의 공감대를 상실했습니다.</li>
                    <li><strong>부자연스러운 번역투/피동 문장</strong>: '에 있어서의', '가짐에 틀림없다', '전문가들에 의해 행해진다' 등 우리말 어법에 어긋나는 기계적이고 어색한 직역적 표현이 지배적입니다.</li>
                </ul>
                <p class="mt-4"><strong>🛠️ 교정 추천 방향:</strong><br>독단적인 선언 대신 신중하고 사려 깊은 완화 어조(~로 보인다, ~일 여지가 크다)로 주장을 부드럽게 설득해 가고, 기계적인 '첫째, 둘째' 열거 대신 자연스러운 연결어를 사용하여 문장의 길이를 다양하게 섞어가며 고쳐보세요.</p>
            `
        },
        
        student: {
            text: `인공지능(AI)이 인간의 지적 노동 영역을 빠르게 대체해 가는 현상은 오늘날 거부하기 힘든 문명적 흐름이다. 과연 이러한 기술의 독주가 인간의 본질적 사유 능력마저 잠식할 것인가에 대해서는 학계와 현장 모두에서 깊은 갈등과 다양한 논란이 나타나고 있다. 일각에서는 AI의 연산 속도와 무한한 정보 탐색 능력이 인간의 생산성을 비약적으로 높일 것으로 기대한다. 하지만 이들의 화려한 장밋빛 전망 속에는 주체적 비판적 사유의 상실이라는 가볍지 않은 구멍이 뚫려 있다.

물론 AI가 제공하는 방대한 초안 작성과 기계적 정리는 대학생들에게 학술적 보조 도구로 유용하게 쓰일 수 있다. 그럼에도 불구하고, 우리는 생성형 AI가 주는 인위적이고 획일적인 문장에 맹목적으로 의존할 때 발생하는 부작용에 주목해야 한다. 기계가 뱉어내는 완벽하게 다듬어진 단어의 무분별한 나열은, 겉보기엔 그럴듯한 사전식 구성으로 읽히지만 결국 글쓴이 고유의 질문 던지기와 투박하나 진정성 있는 통찰을 거세할 가능성이 크기 때문이다. 

따라서 교육 현장에서는 AI의 기계적 활용법을 장려하기에 앞서, 어떻게 학생들이 자신만의 문장 표준편차를 살리며 자연스럽게 논지를 주도할지 그 방법론적 토대를 깊이 있게 가르쳐야 할 필요가 있다. 단조로운 기계적 흐름에서 탈피해 단문과 복문을 입체적으로 교차하며 인간 특유의 조심스러운 주장을 녹여내는 연습이야말로, 인공지능 시대에 인간다운 논증이 살아남는 유일한 길이 아닐까 생각한다.`,
            metrics: { std: "문장 호흡: 다채롭고 리드미컬함", ttr: "단어 배치: 자연스러운 키워드 강조" },
            title: "우수한 논증문 예시",
            coaching: `
                <p><strong>💡 코칭 진단 요약: 역동적인 인간다운 호흡과 신중한 주장 어조의 조화</strong></p>
                <p>저자 고유의 깊이 있는 주체적 생각과 역동적인 글의 흐름이 대단히 잘 호응하는 명문입니다.</p>
                <ul>
                    <li><strong>다채롭고 역동적인 문장 리듬</strong>: 단문과 복문이 다채롭게 섞여 문장의 호흡이 리드미컬하며, 지나친 단정 없이 신중하게 주장을 전개하여 우수합니다. 짧고 호흡이 빠른 문장과 길고 논리적인 문장들이 균형 있게 배치되어 생동감이 넘칩니다.</li>
                    <li><strong>자연스러운 어휘 활용과 주제 강조</strong>: 단어를 억지로 사전식 나열하는 방식에서 벗어나, 'AI', '인간', '문장' 등 꼭 필요한 핵심 키워드를 흐름 속에서 자연스럽고 적절하게 변주해가며 반복 진술합니다.</li>
                    <li><strong>사려 깊고 신중한 논증 태도</strong>: 독단적으로 단정 짓지 않고 '~할 가능성이 크기 때문이다', '~생각한다' 등 조심스럽고 학술적인 완화 어조를 영리하게 사용하여 논리적인 품격과 신뢰성을 확보했습니다.</li>
                    <li><strong>유기적이고 유연한 단락 결합</strong>: 서론에서 던진 현안 문제제기부터 본론의 반론 수용, 그리고 결론의 설득력 있는 대안 제언까지 문맥의 유기적 긴밀성이 훌륭합니다.</li>
                </ul>
            `
        }
    };

    // 실시간 글자수/어절수 체크
    essayInput.addEventListener("input", updateInputStatus);
    
    // 모달 호출 리스너
    btnLoadAi.addEventListener("click", () => openModal("ai"));
    btnLoadStudent.addEventListener("click", () => openModal("student"));
    
    // 모달 닫기 제어
    btnModalX.addEventListener("click", closeModal);
    btnModalClose.addEventListener("click", closeModal);
    
    // 모달 밖 영역 클릭 시 닫기
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // 이 초안 불러와서 고쳐보기 버튼 리스너
    if (btnModalLoad) {
        btnModalLoad.addEventListener("click", () => {
            if (currentExampleKey && EXAMPLES[currentExampleKey]) {
                essayInput.value = EXAMPLES[currentExampleKey].text;
                updateInputStatus();
                closeModal();
            }
        });
    }

    // PDF 리포트 저장 / 인쇄 버튼 리스너
    if (btnPrintReport) {
        btnPrintReport.addEventListener("click", () => {
            window.print();
        });
    }

    // 공통 뷰 전환 헬퍼
    function backToInputView() {
        btnBackToInputTop.style.display = "none"; // 복귀 시 헤더 내 뒤로가기 버튼 숨김
        reportView.style.display = "none";
        inputView.style.display = "block";
        inputView.scrollIntoView({ behavior: "smooth" });
    }

    if (btnBackToInput) btnBackToInput.addEventListener("click", backToInputView);
    if (btnBackToInputTop) btnBackToInputTop.addEventListener("click", backToInputView); // 상단 왼쪽 버튼 리스너 바인딩
    if (btnBackToInputLarge) btnBackToInputLarge.addEventListener("click", backToInputView); // 하단 대형 수정 버튼 바인딩
    
    // 코칭 분석 버튼 클릭
    btnAnalyze.addEventListener("click", performAnalysis);

    // 진짜 학생 글 무작위 불러오기 (프론트엔드 단독형 구현)
    if (btnLoadRandomStudent) {
        btnLoadRandomStudent.addEventListener("click", async () => {
            btnLoadRandomStudent.disabled = true;
            const originalText = btnLoadRandomStudent.textContent;
            btnLoadRandomStudent.textContent = "⚡ 불러오는 중...";
            try {
                const response = await fetch("student_essays.json");
                if (!response.ok) {
                    throw new Error("로컬 에세이 데이터셋(student_essays.json)을 로드하지 못했습니다.");
                }
                const dataList = await response.json();
                if (Array.isArray(dataList) && dataList.length > 0) {
                    const randomEssay = dataList[Math.floor(Math.random() * dataList.length)];
                    essayInput.value = randomEssay.text;
                    updateInputStatus();
                    alert(`[진짜 학생 글 연동 완료] 글 ID: ${randomEssay.id} 초안을 성공적으로 로드했습니다.`);
                } else {
                    throw new Error("에세이 데이터셋이 비어 있습니다.");
                }
            } catch (error) {
                alert(`학생 초안 로드 중 오류가 발생했습니다.\n사유: ${error.message}`);
                console.error(error);
            } finally {
                btnLoadRandomStudent.disabled = false;
                btnLoadRandomStudent.textContent = originalText;
            }
        });
    }

    function updateInputStatus() {
        const text = essayInput.value;
        const charCountWithSpace = text.length;
        const charCountNoSpace = text.replace(/\s/g, "").length;
        
        charCountWithSpaceEl.textContent = `공백 포함: ${charCountWithSpace.toLocaleString()}자`;
        charCountNoSpaceEl.textContent = `공백 제외: ${charCountNoSpace.toLocaleString()}자`;
    }

    function openModal(key) {
        try {
            currentExampleKey = key;
            const data = EXAMPLES[key];
            if (!data) throw new Error("Example data not found for key: " + key);
            
            modalTitle.textContent = data.title || "";
            modalEssayText.textContent = data.text || "";
            modalMetricStd.textContent = data.metrics?.std || "";
            modalMetricTtr.textContent = data.metrics?.ttr || "";
            modalExplanationText.innerHTML = data.coaching || "";
            
            // Remove hidden classes and set display
            modal.classList.remove("hidden", "d-none");
            modal.style.display = "flex";
            
            // Disable body scrolling safely
            document.body.style.overflow = "hidden";
        } catch (error) {
            console.error("Failed to open modal:", error);
            // Defensively restore state to prevent freezing
            closeModal();
        }
    }

    function closeModal() {
        // Hide overlay using class list and direct styling
        modal.classList.add("hidden", "d-none");
        modal.style.display = "none";
        
        // Restore body scroll to auto
        document.body.style.overflow = "auto";
    }

    // 정적 자바스크립트 기반 실시간 채점 분석 엔진 구동
    function performAnalysis(e) {
        if (e && e.preventDefault) e.preventDefault();
        
        const text = essayInput.value.trim();
        if (!text) {
            alert("논증문 초안을 입력해 주세요!");
            return;
        }

        const charCountNoSpace = text.replace(/\s/g, "").length;
        const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
        if (charCountNoSpace < 30 || sentences.length < 2) {
            alert("분석을 위해 최소 2문장, 공백 제외 30자 이상의 완성도 있는 논증문을 입력해주세요.");
            return;
        }

        btnAnalyze.disabled = true;
        analyzeSpinner.style.display = "block";
        btnAnalyze.querySelector(".btn-text").textContent = "⚡ 글 분석 진행 중...";

        setTimeout(() => {
            try {
                const data = calculateScores(text);
                renderReport(data, text);
                
                btnBackToInputTop.style.display = "inline-flex"; // 결과 로드 시 헤더 내 뒤로가기 버튼 노출
                inputView.style.display = "none";
                reportView.style.display = "block";
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                alert(`[분석 에러] 논증문 채점 연산 중 오류가 발생했습니다.\n사유: ${error.message}`);
                console.error(error);
            } finally {
                btnAnalyze.disabled = false;
                analyzeSpinner.style.display = "none";
                btnAnalyze.querySelector(".btn-text").textContent = "🔍 논증문 정밀 분석 및 글쓰기 코칭 받기";
            }
        }, 600); // 실감나는 로딩 효과 시뮬레이션
    }

    // 리포트 렌더링
    function renderReport(data, originalText) {
        // A. 종합 정보 매핑
        document.getElementById("essay-grade-title").textContent = data.grade_commentary;
        document.getElementById("grade-badge").textContent = data.grade;

        // B. 3대 대분류 영역 평균 점수 계산 및 렌더링
        const avgContent = calculateDomainAverage(data.scores, [
            "문제 상황 제시 및 정보성", "주장의 명료성과 일관성", 
            "논거의 설득력과 적절성", "논리 전개의 충분성", "반론 고려 및 신중한 표현"
        ]);
        const avgOrg = calculateDomainAverage(data.scores, [
            "글의 유기적 구조(서론·본론·결론)", "문단의 완결성과 통일성"
        ]);
        const avgExpr = calculateDomainAverage(data.scores, [
            "문장 및 어휘의 자연스러움", "어문 규범 및 장르 관습 준수"
        ]);

        document.getElementById("domain-avg-total").textContent = data.total_average.toFixed(2);
        document.getElementById("domain-avg-content").textContent = avgContent.toFixed(2);
        document.getElementById("domain-avg-org").textContent = avgOrg.toFixed(2);
        document.getElementById("domain-avg-expr").textContent = avgExpr.toFixed(2);

        // C. AI 문체 경고 가이드라인 처리
        const warnAiCriticalCard = document.getElementById("warn-ai-critical-card");
        const warnSentenceCard = document.getElementById("warn-sentence-card");
        const warnWordCard = document.getElementById("warn-word-card");
        const warnNormalCard = document.getElementById("warn-normal-card");

        let hasWarning = false;
        
        if (data.std_sentence_length <= 4.5 || data.word_ttr >= 0.81) {
            warnAiCriticalCard.style.display = "flex";
            hasWarning = true;
        } else {
            warnAiCriticalCard.style.display = "none";
        }

        if (data.ai_sentence_warning) {
            warnSentenceCard.style.display = "flex";
            document.getElementById("warn-sentence-text").textContent = data.ai_sentence_feedback;
            hasWarning = true;
        } else {
            warnSentenceCard.style.display = "none";
        }

        if (data.ai_word_warning) {
            warnWordCard.style.display = "flex";
            document.getElementById("warn-word-text").textContent = data.ai_word_feedback;
            hasWarning = true;
        } else {
            warnWordCard.style.display = "none";
        }

        if (!hasWarning) {
            warnNormalCard.style.display = "flex";
            const warnNormalTextHeader = warnNormalCard.querySelector("h4");
            const warnNormalTextDesc = warnNormalCard.querySelector("p");
            if (data.total_average < 3.5) {
                warnNormalTextHeader.textContent = "기본 문체 흐름 유지 (문장 다양성 보통)";
                warnNormalTextDesc.textContent = "문장의 호흡과 단어 배치에서 획일화된 패턴은 나타나지 않았으나, 나만의 생동감 있는 글을 완성하기 위해 개별 세부 진단 결과의 가이드라인을 참조하여 표현의 다채로움을 보강해 보세요.";
            } else {
                warnNormalTextHeader.textContent = "문체 활력도 우수 (생동감 있는 흐름)";
                warnNormalTextDesc.textContent = "글의 문장 길이 편차가 풍부하고 자연스러워 생동감과 활력이 넘칩니다! 나만의 개성이 조화롭게 어우러진 훌륭한 문맥 흐름입니다.";
            }
        } else {
            warnNormalCard.style.display = "none";
        }

        // D. 4대 정밀 계량 지표 렌더링
        document.getElementById("val-std-len").textContent = data.std_sentence_length.toFixed(2);
        document.getElementById("val-word-ttr").textContent = data.word_ttr.toFixed(3);
        document.getElementById("val-morph-ttr").textContent = data.morpheme_ttr.toFixed(3);
        document.getElementById("val-hedge").textContent = data.total_hedge_density.toFixed(2);

        // 게이지 바 애니메이션 업데이트
        const stdPercent = Math.min(100, (data.std_sentence_length / 10) * 100);
        document.getElementById("gauge-std-len").style.width = `${stdPercent}%`;
        document.getElementById("gauge-word-ttr").style.width = `${data.word_ttr * 100}%`;
        document.getElementById("gauge-morph-ttr").style.width = `${data.morpheme_ttr * 100}%`;
        const hedgePercent = Math.min(100, (data.total_hedge_density / 15) * 100);
        document.getElementById("gauge-hedge").style.width = `${hedgePercent}%`;

        // E. 3대 영역별 상세 가로 바 그래프 렌더링
        renderDomainBarCharts(data.scores);

        // F. SVG 삼각형 Radar Chart 렌더링
        renderTriangleRadarChart(avgContent, avgOrg, avgExpr);

        // G. 첨삭 지도 하이라이터 및 오용 표현 목록 테이블 바인딩
        renderHighlights(originalText, data.highlights, data.total_average);

        // H. 3대 영역별 상세 평가 피드백 카드 렌더링 및 대상 문장 동적 매핑
        renderDomainFeedbackCards(data, originalText);

        // I. 안내 툴팁(i 마크) 자바스크립트/CSS 인터랙션 기능 활성화
        initTooltips();
    }

    function calculateDomainAverage(scores, keys) {
        let sum = 0;
        let count = 0;
        keys.forEach(k => {
            if (scores[k]) {
                sum += scores[k].score;
                count++;
            }
        });
        return count > 0 ? sum / count : 0.0;
    }

    // 4. 안내 툴팁(i 마크) 자바스크립트/CSS 인터랙션 기능 구현
    function initTooltips() {
        const tooltips = document.querySelectorAll(".info-icon");
        
        tooltips.forEach(icon => {
            // 중복 이벤트 등록을 방지하기 위해 cloneNode로 리스너 초기화
            const newIcon = icon.cloneNode(true);
            icon.parentNode.replaceChild(newIcon, icon);
            
            // 기존 툴팁 엘리먼트 제거
            const existingTooltip = newIcon.querySelector(".info-tooltip");
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            const text = newIcon.getAttribute("data-tooltip");
            if (!text) return;
            
            // 자식으로 툴팁 엘리먼트 동적 주입
            const tooltipBox = document.createElement("div");
            tooltipBox.className = "info-tooltip";
            tooltipBox.textContent = text;
            newIcon.appendChild(tooltipBox);
            
            // 마우스 이벤트로 visibility 및 opacity 전환 보정
            newIcon.addEventListener("mouseenter", () => {
                tooltipBox.style.display = "block";
                setTimeout(() => {
                    tooltipBox.style.opacity = "1";
                    tooltipBox.style.visibility = "visible";
                }, 10);
            });
            
            newIcon.addEventListener("mouseleave", () => {
                tooltipBox.style.opacity = "0";
                tooltipBox.style.visibility = "hidden";
                setTimeout(() => {
                    tooltipBox.style.display = "none";
                }, 150);
            });
        });
    }

    // SVG 삼각형 Radar Chart
    function renderTriangleRadarChart(scoreContent, scoreOrg, scoreExpr) {
        const svg = document.getElementById("radar-chart");
        svg.innerHTML = ""; 

        const cx = 200;
        const cy = 215; 
        const r = 135; 
        
        const orderOfDomains = [
            { name: "내용", score: scoreContent },
            { name: "조직", score: scoreOrg },
            { name: "표현", score: scoreExpr }
        ];

        const totalPoints = 3;
        const angleStep = (2 * Math.PI) / totalPoints; 

        // 동심 삼각형 그리드망 드로잉
        for (let level = 1; level <= 5; level++) {
            const levelRadius = (r / 5) * level;
            const points = [];
            
            for (let i = 0; i < totalPoints; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = cx + levelRadius * Math.cos(angle);
                const y = cy + levelRadius * Math.sin(angle);
                points.push(`${x},${y}`);
            }

            const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            polygon.setAttribute("points", points.join(" "));
            polygon.setAttribute("class", "radar-grid-line");
            svg.appendChild(polygon);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", cx);
            text.setAttribute("y", cy - levelRadius + 3);
            text.setAttribute("class", "radar-grid-text");
            text.textContent = level;
            svg.appendChild(text);
        }

        // 축 및 꼭짓점 영역별 라벨
        for (let i = 0; i < totalPoints; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const ax = cx + r * Math.cos(angle);
            const ay = cy + r * Math.sin(angle);
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", cx);
            line.setAttribute("y1", cy);
            line.setAttribute("x2", ax);
            line.setAttribute("y2", ay);
            line.setAttribute("class", "radar-axis-line");
            svg.appendChild(line);

            const tx = cx + (r + 25) * Math.cos(angle);
            const ty = cy + (r + 15) * Math.sin(angle) + 4;
            
            const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            labelText.setAttribute("x", tx);
            labelText.setAttribute("y", ty);
            labelText.setAttribute("class", "radar-label");
            labelText.textContent = orderOfDomains[i].name;
            svg.appendChild(labelText);
        }

        // 실제 다각형 그리기
        const actualPoints = [];
        for (let i = 0; i < totalPoints; i++) {
            const domain = orderOfDomains[i];
            const scoreRadius = (r / 5) * domain.score;
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + scoreRadius * Math.cos(angle);
            const y = cy + scoreRadius * Math.sin(angle);
            actualPoints.push({ x, y, name: domain.name, score: domain.score });
        }

        const polyPointsString = actualPoints.map(p => `${p.x},${p.y}`).join(" ");
        const actualPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        actualPolygon.setAttribute("points", polyPointsString);
        actualPolygon.setAttribute("class", "radar-area");
        svg.appendChild(actualPolygon);

        actualPoints.forEach(p => {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", 5.5);
            circle.setAttribute("class", "radar-point");
            
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = `${p.name} 영역 평균: ${p.score.toFixed(2)}점`;
            circle.appendChild(title);
            svg.appendChild(circle);
        });
    }

    // 가로형 바 그래프 렌더링
    function renderDomainBarCharts(scores) {
        const contentContainer = document.getElementById("bar-list-content");
        const orgContainer = document.getElementById("bar-list-org");
        const exprContainer = document.getElementById("bar-list-expr");

        contentContainer.innerHTML = "";
        orgContainer.innerHTML = "";
        exprContainer.innerHTML = "";

        const groups = {
            content: [
                "문제 상황 제시 및 정보성", "주장의 명료성과 일관성", 
                "논거의 설득력과 적절성", "논리 전개의 충분성", "반론 고려 및 신중한 표현"
            ],
            org: ["글의 유기적 구조(서론·본론·결론)", "문단의 완결성과 통일성"],
            expr: ["문장 및 어휘의 자연스러움", "어문 규범 및 장르 관습 준수"]
        };

        function drawBars(keys, container, fillClass) {
            keys.forEach(key => {
                const scoreObj = scores[key];
                const score = scoreObj ? scoreObj.score : 0.0;
                const percent = (score / 5.0) * 100;

                const barItem = document.createElement("div");
                barItem.className = "bar-item";
                barItem.innerHTML = `
                    <div class="bar-info">
                        <span class="bar-label">${key}</span>
                        <span class="bar-score">${score.toFixed(1)} / 5.0</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill ${fillClass}" id="bar-fill-${key}" style="width: 0%;"></div>
                    </div>
                `;

                barItem.addEventListener("click", () => {
                    const targetCard = document.getElementById(`eval-card-${key}`);
                    if (targetCard) {
                        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
                        const originalBg = targetCard.style.backgroundColor;
                        targetCard.style.backgroundColor = "#dcfce7"; // 오토 포커스 시 연한 초록빛 강조 효과
                        setTimeout(() => {
                            targetCard.style.backgroundColor = originalBg;
                        }, 1200);
                    }
                });

                container.appendChild(barItem);

                setTimeout(() => {
                    const fillEl = document.getElementById(`bar-fill-${key}`);
                    if (fillEl) fillEl.style.width = `${percent}%`;
                }, 50);
            });
        }

        drawBars(groups.content, contentContainer, "bar-list-content-fill");
        drawBars(groups.org, orgContainer, "bar-list-org-fill");
        drawBars(groups.expr, exprContainer, "bar-list-expr-fill");
    }

    // 첨삭 지도 하이라이터 & 교정 테이블 바인딩
    function renderHighlights(text, highlights, totalAverage) {
        const viewer = document.getElementById("highlighted-text-viewer");
        viewer.innerHTML = "";

        // 기존에 렌더링된 맞춤법 교정 테이블 제거
        const existingTable = viewer.parentElement.querySelector(".correction-table-wrapper");
        if (existingTable) {
            existingTable.remove();
        }

        if (!highlights || highlights.length === 0) {
            if (totalAverage < 3.5) {
                viewer.innerHTML = `
                    <div class="no-highlights-card">
                        <span class="no-hl-icon">📝</span>
                        <span class="no-hl-title">기본적 문맥 어법 준수</span>
                        <p class="no-hl-text">본 분석기에서 사전에 등록된 대표적인 번역투나 구어체 오용은 직접 검출되지 않았으나, 글 전반의 구조적 논증성과 문단 완결성을 보완하기 위해 아래의 영역별 상세 코칭 가이드를 확인해 주세요.</p>
                    </div>
                `;
            } else if (totalAverage < 4.0) {
                viewer.innerHTML = `
                    <div class="no-highlights-card">
                        <span class="no-hl-icon">🌱</span>
                        <span class="no-hl-title">자연스러운 학술 표현 및 문맥</span>
                        <p class="no-hl-text">대표적인 번역투나 구어체 오용이 식별되지 않아 문장 흐름이 자연스럽습니다. 기본적인 요건을 잘 갖추었으므로 주장의 일관성을 유지하며 완성도를 높여보세요.</p>
                    </div>
                `;
            } else {
                viewer.innerHTML = `
                    <div class="no-highlights-card">
                        <span class="no-hl-icon">🎉</span>
                        <span class="no-hl-title">완벽하고 자연스러운 학술 표현</span>
                        <p class="no-hl-text">현재 글에서 교정이나 대체가 필요한 기계적인 표현이 발견되지 않았습니다.<br>매끄럽고 자연스럽게 작성된 글입니다.</p>
                    </div>
                `;
            }
            return;
        }

        const validHighlights = [];
        let lastEnd = 0;

        highlights.forEach(hl => {
            if (hl.start >= lastEnd && hl.end <= text.length) {
                validHighlights.push(hl);
                lastEnd = hl.end;
            }
        });

        let lastIdx = text.length;
        let htmlContent = "";

        for (let i = validHighlights.length - 1; i >= 0; i--) {
            const hl = validHighlights[i];
            const trailingText = text.substring(hl.end, lastIdx);
            const tokenText = text.substring(hl.start, hl.end);
            
            let typeClass = "hl-translation";
            if (hl.type === "assertion") typeClass = "hl-assertion";
            else if (hl.type === "style_issue") typeClass = "hl-style";

            const spanHtml = `<span class="hl-token ${typeClass}" data-tip="${hl.tip}">${tokenText}</span>`;
            htmlContent = spanHtml + escapeHtml(trailingText) + htmlContent;
            lastIdx = hl.start;
        }

        const leadingText = text.substring(0, lastIdx);
        htmlContent = escapeHtml(leadingText) + htmlContent;
        viewer.innerHTML = htmlContent;

        // 요구사항 2 - '첨삭 지도 및 문장 표현 교정기' 테이블 동적 바인딩 및 렌더링
        if (validHighlights.length > 0) {
            const rows = validHighlights.map(hl => {
                let badgeText = "";
                let badgeClass = "";
                if (hl.type === "translation_style") {
                    badgeText = "AI 번역투";
                    badgeClass = "legend-translation";
                } else if (hl.type === "assertion") {
                    badgeText = "지나친 단정";
                    badgeClass = "legend-assertion";
                } else {
                    badgeText = "비학술 구어체";
                    badgeClass = "legend-style";
                }
                
                return `
                    <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
                        <td style="padding: 0.75rem 1rem;"><span class="legend-item ${badgeClass}" style="margin: 0; padding: 0.2rem 0.5rem; font-size: 0.8rem; border-radius: 4px; display: inline-block; font-weight: 500;"><span class="color-dot" style="margin-right: 4px;"></span>${badgeText}</span></td>
                        <td style="padding: 0.75rem 1rem; font-weight: 600; color: #e11d48; font-family: monospace;">${escapeHtml(hl.text)}</td>
                        <td style="padding: 0.75rem 1rem; color: #334155; font-size: 0.85rem; line-height: 1.4;">${escapeHtml(hl.tip)}</td>
                    </tr>
                `;
            }).join("");
            
            const tableHtml = `
                <div class="correction-table-wrapper" style="margin-top: 1.5rem; overflow-x: auto; background: white; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm);">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 500px; font-family: inherit;">
                        <thead>
                            <tr style="border-bottom: 2px solid #cbd5e1; background-color: #f8fafc;">
                                <th style="padding: 0.75rem 1rem; color: #475569; font-weight: 600; font-size: 0.85rem; width: 120px;">구분</th>
                                <th style="padding: 0.75rem 1rem; color: #475569; font-weight: 600; font-size: 0.85rem; width: 180px;">원문 표현</th>
                                <th style="padding: 0.75rem 1rem; color: #475569; font-weight: 600; font-size: 0.85rem;">교정 가이드</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            `;
            viewer.insertAdjacentHTML("afterend", tableHtml);
        }
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 실제 본문 연관 문장 파서 
    function findTargetSentences(text, keywordList, highlightTypeList = [], highlights = [], maxCount = 1) {
        if (!text) return [];
        const sentences = text.split(/(?<=[.!?])\s+/);
        const results = [];
        
        if (highlightTypeList.length > 0 && highlights && highlights.length > 0) {
            for (let hl of highlights) {
                if (highlightTypeList.includes(hl.type)) {
                    const match = sentences.find(s => s.includes(hl.text));
                    if (match && !results.includes(match.trim())) {
                        results.push(match.trim());
                        if (results.length >= maxCount) return results;
                    }
                }
            }
        }
        
        if (keywordList && keywordList.length > 0) {
            for (let kw of keywordList) {
                const matches = sentences.filter(s => s.includes(kw));
                for (let match of matches) {
                    if (match && !results.includes(match.trim())) {
                        results.push(match.trim());
                        if (results.length >= maxCount) return results;
                    }
                }
            }
        }
        
        return results;
    }

    // 3대 영역 피드백 카드 렌더링 (배경색 설정 및 마우스 오버 인터랙션 추가)
    function renderDomainFeedbackCards(data, originalText) {
        const scores = data.scores;
        const contentList = document.getElementById("eval-list-content");
        const orgList = document.getElementById("eval-list-org");
        const exprList = document.getElementById("eval-list-expr");

        contentList.innerHTML = "";
        orgList.innerHTML = "";
        exprList.innerHTML = "";

        const groups = {
            content: [
                "문제 상황 제시 및 정보성", "주장의 명료성과 일관성", 
                "논거의 설득력과 적절성", "논리 전개의 충분성", "반론 고려 및 신중한 표현"
            ],
            org: ["글의 유기적 구조(서론·본론·결론)", "문단의 완결성과 통일성"],
            expr: ["문장 및 어휘의 자연스러움", "어문 규범 및 장르 관습 준수"]
        };

        function drawCards(keys, container, domainClass) {
            keys.forEach(key => {
                const scoreObj = scores[key];
                const score = scoreObj ? scoreObj.score : 0.0;
                const desc = scoreObj ? scoreObj.description : "상세 솔루션 평가 데이터가 존재하지 않습니다.";

                const maxSentences = score <= 3.0 ? 3 : 1;
                let targetSentences = [];
                if (key === "문제 상황 제시 및 정보성") {
                    targetSentences = findTargetSentences(originalText, ['문제', '논란', '최근', '실태', '현실', '갈등', '현상'], [], [], maxSentences);
                } else if (key === "주장의 명료성과 일관성") {
                    targetSentences = findTargetSentences(originalText, ['해야 한다', '필요하다', '요구된다', '바람직하다', '생각한다'], [], [], maxSentences);
                } else if (key === "논거의 설득력과 적절성") {
                    targetSentences = findTargetSentences(originalText, ['왜냐하면', '때문이다', '이유는', '연구', '통계', '조사', '분석', '자료'], [], [], maxSentences);
                } else if (key === "논리 전개의 충분성") {
                    targetSentences = findTargetSentences(originalText, ['의미한다', '결과', '사례', '사실', '나타난다', '따라서'], [], [], maxSentences);
                } else if (key === "반론 고려 및 신중한 표현") {
                    targetSentences = findTargetSentences(originalText, ['물론', '반면', '일각에서는', '수 있다', '보인다', '생각한다'], ['assertion'], data.highlights, maxSentences);
                } else if (key === "글의 유기적 구조(서론·본론·결론)") {
                    targetSentences = findTargetSentences(originalText, ['첫째', '둘째', '셋째', '하지만', '그러나', '따라서', '결론적으로'], [], [], maxSentences);
                } else if (key === "문단의 완결성과 통일성") {
                    targetSentences = findTargetSentences(originalText, ['중심', '본질', '핵심', '개념', '결국', '과연'], [], [], maxSentences);
                } else if (key === "문장 및 어휘의 자연스러움") {
                    targetSentences = findTargetSentences(originalText, [], ['translation_style'], data.highlights, maxSentences);
                    if (targetSentences.length === 0) {
                        const sentences = originalText.split(/(?<=[.!?])\s+/);
                        const fallback = sentences.find(s => s.split(/\s+/).length < 5);
                        if (fallback) targetSentences.push(fallback.trim());
                    }
                } else if (key === "어문 규범 및 장르 관습 준수") {
                    targetSentences = findTargetSentences(originalText, [], ['style_issue'], data.highlights, maxSentences);
                }

                let targetSentenceHtml = "";
                if (targetSentences && targetSentences.length > 0) {
                    const listHtml = targetSentences.map(s => {
                        let displaySentence = s;
                        if (displaySentence.length > 105) {
                            displaySentence = displaySentence.substring(0, 100) + "...";
                        }
                        
                        let coachComment = "";
                        if (score < 2.5) {
                            if (key === "문제 상황 제시 및 정보성") {
                                coachComment = "서론에서 문제제기가 전혀 이루어지지 않았거나 모호합니다. 독자의 이목을 끌 수 있도록 문제 상황과 사회적 배경을 집중 보완해야 합니다.";
                            } else if (key === "주장의 명료성과 일관성") {
                                coachComment = "주제가 명확하지 않거나 무엇을 옹호하는지 알기 어렵습니다. 주장하는 요지가 선명한 하나의 완전한 선언문 형태로 집중 보강되어야 합니다.";
                            } else if (key === "논거의 설득력과 적절성") {
                                coachComment = "주장에 대한 객관적 증명이 전혀 결여되었습니다. 신뢰할 수 있는 외부 통계 수치나 연구 데이터 등을 집중 보완하여 문장의 논거를 갖추어야 합니다.";
                            } else if (key === "논리 전개의 충분성") {
                                coachComment = "소주제에 대한 설명이나 인과적 전개가 너무 빈약하여 설명력이 결여되었습니다. 독자가 흐름을 이해할 수 있도록 논리 전개를 집중 보완해야 합니다.";
                            } else if (key === "반론 고려 및 신중한 표현") {
                                coachComment = "지나치게 독단적이고 예외 가능성을 원천 차단하고 있습니다. 좋은 논증을 위해 완화 어구(~로 해석된다, ~할 여지가 크다)를 필수적으로 활용해 조심스러운 주조로 보완해 보세요.";
                            } else if (key === "글의 유기적 구조(서론·본론·결론)") {
                                coachComment = "서론-본론-결론 간의 경계가 흐릿하고 문장 연결이 단절되어 있습니다. 논리적 인과 흐름을 살릴 수 있는 문장 전환 어휘를 사용해 삼단 구조를 집중 보강해야 합니다.";
                            } else if (key === "문단의 완결성과 통일성") {
                                coachComment = "문단 내의 일관된 내용 구조가 심각하게 흐트러져 있습니다. 하나의 문단은 하나의 소주제만을 깊이 서술하도록 구조를 집중 개선해야 합니다.";
                            } else if (key === "문장 및 어휘의 자연스러움") {
                                coachComment = "문장의 길이가 전부 비슷하고 단어들이 단순 사전식으로 무리하게 나열되어 있어 부자연스럽습니다. 문장 구조의 변주와 단어 배치를 집중 개선해 보세요.";
                            } else if (key === "어문 규범 및 장르 관습 준수") {
                                coachComment = "구어체 표현이나 격식 없는 어미의 사용이 너무 잦아 논증문의 장르적 신뢰성을 크게 해칩니다. 표준 문어체로 문장을 집중 교정해야 합니다.";
                            } else {
                                coachComment = "이 문장은 내용과 논조의 연결에 심각한 공백이 발견되어 구조적인 집중 보완이 필요합니다.";
                            }
                        } else if (score < 4.0) {
                            if (key === "문제 상황 제시 및 정보성") {
                                coachComment = "서론의 문제제기가 존재하나, 독자가 현안의 중요성을 즉각 체감할 수 있도록 구체적인 통계나 실태 배경을 보강해 주는 문장입니다.";
                            } else if (key === "주장의 명료성과 일관성") {
                                coachComment = "중심 생각을 보다 선명한 주장형 문장으로 다듬어 일관된 주장으로 수렴하도록 보정해야 합니다.";
                            } else if (key === "논거의 설득력과 적절성") {
                                coachComment = "주관적인 진술에 머물러 있습니다. 학술 연구나 전문 통계자료 등의 공신력 있는 외부 논거 인용이 필요한 문장입니다.";
                            } else if (key === "논리 전개의 충분성") {
                                coachComment = "생략이나 논리적 비약 없이 소주제를 뒷받침할 구체적인 해설과 인과적 충실도를 보완해야 하는 지점입니다.";
                            } else if (key === "반론 고려 및 신중한 표현") {
                                coachComment = "문맥의 흐름이 다소 일정하거나 주장에 지나친 단정이 포함되어 있어, 완화 표현을 통해 논조를 조금 더 부드럽게 다듬는 것을 권장합니다.";
                            } else if (key === "글의 유기적 구조(서론·본론·결론)") {
                                coachComment = "서론-본론-결론의 유기적 긴밀함을 위해 논리적 인과 고리를 채워줄 접속사나 전환 표현을 다듬어야 합니다.";
                            } else if (key === "문단의 완결성과 통일성") {
                                coachComment = "한 문단이 하나의 일관된 개념 단위를 이루도록 소주제 배분 및 세부 문장의 통일성을 가다듬어야 합니다.";
                            } else if (key === "문장 및 어휘의 자연스러움") {
                                coachComment = "문장의 호흡이 비교적 균일하여 단조로운 인상을 줄 수 있습니다. 생각의 호흡에 맞춰 짧은 문장과 긴 문장을 섞고 번역투를 정돈해 보세요.";
                            } else if (key === "어문 규범 및 장르 관습 준수") {
                                coachComment = "격식 있는 표준 문어체 종결어미(~다.)와 문장 부호 규범을 준수하도록 매끄럽게 교정해야 하는 문장입니다.";
                            } else {
                                coachComment = "이 문장은 문맥의 연결이 매끄럽지 못하고 다소 정형화된 어투가 남아 있어 보완이 필요합니다.";
                            }
                        } else {
                            if (key === "문제 상황 제시 및 정보성") {
                                coachComment = "서론에서 당면 현안과 배경을 선명하게 환기하여 정보성과 학술적 흡입력이 뛰어난 문장입니다.";
                            } else if (key === "주장의 명료성과 일관성") {
                                coachComment = "핵심적인 견해가 명확하게 서술되어 독자에게 명확한 방향성과 강한 인상을 주는 우수 문장입니다.";
                            } else if (key === "논거의 설득력과 적절성") {
                                coachComment = "사실적 근거와 외부 조사의 적절한 인용을 배합하여 주장의 논리적 신뢰성을 탄탄하게 확립한 대목입니다.";
                            } else if (key === "논리 전개의 충분성") {
                                coachComment = "하위 논증을 성실하고 깊이 있게 풀어서 논리 전개의 분석적 완결성을 아름답게 증명한 문장입니다.";
                            } else if (key === "반론 고려 및 신중한 표현") {
                                coachComment = "다채로운 어휘를 사용하면서 주장을 신중하고 설득력 있게 전개하여 훌륭합니다.";
                            } else if (key === "글의 유기적 구조(서론·본론·결론)") {
                                coachComment = "삼단 논리 구성과 유연한 단락 전환으로 논리 전개의 부드러운 가독성을 배가시키는 훌륭한 문장입니다.";
                            } else if (key === "문단의 완결성과 통일성") {
                                coachComment = "문단의 길이 비율이 시각적으로 조화로우며, 핵심 주제를 중심으로 완결성 높은 구조를 갖추었습니다.";
                            } else if (key === "문장 및 어휘의 자연스러움") {
                                coachComment = "단조롭지 않은 어절 다양성과 자연스러운 키워드 강조가 조화를 이룬 아주 리드미컬한 글쓰기 호흡입니다.";
                            } else if (key === "어문 규범 및 장르 관습 준수") {
                                coachComment = "표준적인 종결어미와 부호 등의 표준 어법을 일관되게 고수하여 장르 관습적 격식을 완벽히 준수했습니다.";
                            } else {
                                coachComment = "다채로운 어휘를 사용하면서 주장을 신중하고 설득력 있게 전개하여 훌륭합니다.";
                            }
                        }
                        
                        return `
                            <div class="target-sentence-item">
                                <p class="target-text">"${displaySentence}"</p>
                                <p class="target-comment">${coachComment}</p>
                            </div>
                        `;
                    }).join("");

                    targetSentenceHtml = `
                        <div class="eval-target-sentence">
                            <span class="target-badge">연관 문장</span>
                            ${listHtml}
                        </div>
                    `;
                }

                const card = document.createElement("div");
                card.className = `eval-card ${domainClass}`;
                card.id = `eval-card-${key}`;
                card.innerHTML = `
                    <div class="eval-header">
                        <div class="eval-title">${key}</div>
                        <span class="eval-score-badge">${score.toFixed(1)} / 5.0</span>
                    </div>
                    <div class="eval-body">${desc}</div>
                    ${targetSentenceHtml}
                `;

                // 점수대별 가중 톤 클래스 부여 (1.0~2.0 다홍색, 2.1~2.9 주황색)
                const roundedScore = parseFloat(score.toFixed(1));
                if (roundedScore >= 1.0 && roundedScore <= 2.0) {
                    card.classList.add("card-score-danger");
                } else if (roundedScore >= 2.1 && roundedScore <= 2.9) {
                    card.classList.add("card-score-warning");
                }

                container.appendChild(card);
            });
        }

        drawCards(groups.content, contentList, "card-content");
        drawCards(groups.org, orgList, "card-org");
        drawCards(groups.expr, exprList, "card-expr");
    }

    // 초기 화면 로드 시 정적 툴팁 바인딩
    initTooltips();
});

// ==========================================================================
// 100% 프론트엔드 단독 채점 연산 엔진 및 유틸리티 함수
// ==========================================================================

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenizeFallbackOkt(text) {
    const particles = [
        '은', '는', '이', '가', '을', '를', '의', '에', '에게', '에서', 
        '와', '과', '으로', '로', '도', '만', '까지', '마저', '조차', '부터', '나', '이나'
    ];
    const endings = [
        '다', '요', '며', '고', '게', '어', '아', '지', '네', '어라', '아라', '자', '소서',
        '습니다', '니다', '해요', '지요', '고요', '면서', '며', '으나', '지만', '는데'
    ];
    const cleaned = text.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    const words = cleaned.split(/\s+/).filter(Boolean);
    const morphemes = [];
    
    for (let word of words) {
        let matched = false;
        // 조사 분리 시도 (긴 패턴부터 매칭)
        const sortedParticles = [...particles].sort((a, b) => b.length - a.length);
        for (let p of sortedParticles) {
            if (word.endsWith(p) && word.length > p.length) {
                const stem = word.slice(0, -p.length);
                morphemes.push(stem, p);
                matched = true;
                break;
            }
        }
        
        if (!matched) {
            // 어미 분리 시도
            const sortedEndings = [...endings].sort((a, b) => b.length - a.length);
            for (let e of sortedEndings) {
                if (word.endsWith(e) && word.length > e.length) {
                    const stem = word.slice(0, -e.length);
                    morphemes.push(stem, e);
                    matched = true;
                    break;
                }
            }
        }
        
        if (!matched) {
            morphemes.push(word);
        }
    }
    return morphemes;
}

function calculateScores(text) {
    const cleanText = text.trim();
    const charCount = cleanText.length;
    
    // 문장 단위 분절
    const sentences = cleanText.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
    const sentenceCount = sentences.length;
    
    // 문단 단위 분절
    const paragraphs = cleanText.split(/\n+/).map(p => p.trim()).filter(Boolean);
    const paragraphCount = paragraphs.length;
    
    // 공백 및 문장부호 제외 어절 단위 분절
    const words = cleanText.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    
    // 1) 문장별 어절 수의 표준편차 계산
    const sentenceLengths = sentences.map(s => s.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').split(/\s+/).filter(Boolean).length);
    const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / (sentenceLengths.length || 1);
    const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / (sentenceLengths.length || 1);
    const stdSentenceLength = Math.sqrt(variance);
    
    // 2) 어절 다양성 계산 (TTR 대용)
    const uniqueWords = new Set(words);
    const wordTtr = wordCount > 0 ? uniqueWords.size / wordCount : 0.0;
    
    // 3) 형태소 다양성 계산 (FallbackOkt 기반)
    const morphemes = tokenizeFallbackOkt(cleanText);
    const uniqueMorphemes = new Set(morphemes);
    const morphemeTtr = morphemes.length > 0 ? uniqueMorphemes.size / morphemes.length : 0.5;
    
    // 4) 완화 표현 밀도 계산 (1,000어절 기준)
    const hedgeKeywords = [
        '수 있다', '보인다', '생각된다', '듯하다', '경향이',
        '것으로 보인다', '라 할 수 있다', '라고 생각한다', 
        '인 것 같다', '임을 알 수 있다', '할 필요가 있다', '해야 할 것이다'
    ];
    let hedgeCount = 0;
    hedgeKeywords.forEach(expr => {
        const pattern = new RegExp(expr.split(/\s+/).map(w => escapeRegExp(w)).join('\\s*'), 'g');
        const matches = cleanText.match(pattern);
        if (matches) {
            hedgeCount += matches.length;
        }
    });
    const totalHedgeDensity = wordCount > 0 ? (hedgeCount / wordCount) * 1000 : 0.0;

    // 맞춤법 및 오용 문체 로컬 사전 스캔 및 하이라이트 생성
    const highlights = [];
    const SPELL_RULES = [
        { pattern: /않하고/g, text: "않하고", type: "style_issue", tip: "구어체 및 부정 표현 오류 ('않하고' -> '안 하고'). '않-'은 '아니하다'의 준말로 동사 앞에 단독으로 쓰이지 않습니다." },
        { pattern: /않돼/g, text: "않돼", type: "style_issue", tip: "맞춤법 오류 ('않돼' -> '안 돼'). '안'은 '아니'의 준말이며 '돼'는 '되어'의 준말입니다." },
        { pattern: /어의없/g, text: "어의없다", type: "style_issue", tip: "어휘 선택 오류 ('어의없다' -> '어이없다'). '어의'는 임금의 의사 또는 임금의 옷을 뜻합니다." },
        { pattern: /바램/g, text: "바램", type: "style_issue", tip: "맞춤법 오류 ('바램' -> '바람'). '바라다'에서 파생된 명사형은 '바람'이 표준어입니다." },
        { pattern: /역활/g, text: "역활", type: "style_issue", tip: "어휘 오류 ('역활' -> '역할'). 직무나 행동 분담을 뜻하는 표준어는 '역할(役割)'입니다." },
        { pattern: /에\s*있어서의/g, text: "에 있어서의", type: "translation_style", tip: "일본어식 번역투 표현 (~에 있어서의 -> ~의 / ~에 관한)" },
        { pattern: /에\s*의해\s*행해지다/g, text: "에 의해 행해지다", type: "translation_style", tip: "수동적 번역 표현 (~에 의해 행해지다 -> ~가 수행하다)" },
        { pattern: /가짐에\s*틀림없다/g, text: "가짐에 틀림없다", type: "translation_style", tip: "부자연스러운 번역투 조동사 표현 (~가짐에 틀림없다 -> ~임이 분명하다)" },
        { pattern: /생각되어진다/g, text: "생각되어진다", type: "translation_style", tip: "이중 피동형 문장 (생각되어진다 -> 생각된다 / 판단한다)" },
        { pattern: /보여진다/g, text: "보여진다", type: "translation_style", tip: "이중 피동형 문장 (보여진다 -> 보인다)" },
        { pattern: /우리는\s+[^.!?]*(해야\s*한다|할\s*필요가\s*있다)/g, text: "우리는 ~해야 한다", type: "translation_style", tip: "AI 특유의 교시적/공허한 의무문 표현 (주어를 명확히 하고 능동태로 고쳐보세요)" },
        { pattern: /결코/g, text: "결코", type: "assertion", tip: "지나친 단정 표현 (학술문에서는 예외 가능성을 열어두는 완곡한 전개가 좋습니다)" },
        { pattern: /무조건/g, text: "무조건", type: "assertion", tip: "지나친 극단적 어휘 (무조건 -> 타당하게 / 상황에 따라)" },
        { pattern: /절대/g, text: "절대", type: "assertion", tip: "지나친 극단적 어휘 (절대 -> 대체로 / 사실상)" },
        { pattern: /반드시/g, text: "반드시", type: "assertion", tip: "단정적 확신 표현 (반드시 -> ~할 여지가 크다 / ~로 해석된다)" },
        { pattern: /100%/g, text: "100%", type: "assertion", tip: "비학술적 단정 수치 (100% -> 압도적으로 / 높은 확률로)" },
        { pattern: /\b(요|죠)\b[.!?]/g, text: "요/죠", type: "style_issue", tip: "논증문에 어울리지 않는 구어체 종결어미 (요/죠 -> ~다)" },
        { pattern: /\b(했어요|했죠|합니다만)\b/g, text: "했어요/했죠/합니다만", type: "style_issue", tip: "구어체 동사 활용 (했어요 -> 하였다 / 진행했다)" },
        { pattern: /\b(진짜|되게|엄청|겁나|넘)\b/g, text: "진짜/되게/엄청", type: "style_issue", tip: "구어체 수식어 사용 (지양하고 '매우', '현저히', '상당히' 등으로 교체하세요)" },
        { pattern: /\b(해서|했음|했슴|음)\b[.!?]/g, text: "해서/했음/음", type: "style_issue", tip: "명사형/약식 종결 종결어미 (논증문에서는 명확한 서술어 '~다.'로 마쳐야 합니다)" }
    ];

    SPELL_RULES.forEach(rule => {
        let match;
        rule.pattern.lastIndex = 0;
        while ((match = rule.pattern.exec(cleanText)) !== null) {
            highlights.push({
                start: match.index,
                end: match.index + match[0].length,
                type: rule.type,
                text: match[0],
                tip: rule.tip
            });
            if (match.index === rule.pattern.lastIndex) {
                rule.pattern.lastIndex++;
            }
        }
    });
    highlights.sort((a, b) => a.start - b.start);

    // 9대 세부 채점 연산
    const scores = {};
    
    // 1) 문장 및 어휘의 자연스러움 (Expression 1)
    let expr1Score = 3.0;
    let expr1Desc = "";
    if (stdSentenceLength <= 4.5 || wordTtr >= 0.81) {
        expr1Score = (stdSentenceLength <= 4.0 || wordTtr >= 0.83) ? 1.5 : 2.0;
        expr1Desc = "모든 문장의 길이가 비슷비슷해서 글이 다소 단조롭게 느껴지거나, 어려운 낱말을 무리하게 나열하여 핵심 내용이 한눈에 들어오지 않을 수 있습니다. 생각의 흐름에 따라 긴 문장과 짧은 문장을 골고루 섞어 쓰고, 중요한 중심 단어는 자연스럽게 반복하여 일관성을 높여 보세요.";
    } else if (stdSentenceLength >= 5.5 && (wordTtr >= 0.75 && wordTtr <= 0.78)) {
        expr1Score = stdSentenceLength >= 6.2 ? 5.0 : 4.5;
        expr1Desc = "글 고유의 다채롭고 역동적인 문장 길이 편차(5.5 이상)와 글쓴이만의 핵심어가 자연스럽게 강조·순환되는 고유 어절 구조(0.75~0.78)가 매우 조화롭습니다. 읽기 편안하고 자연스러운 글쓰기 흐름을 잘 보여주고 있습니다.";
    } else {
        let base = 3.0;
        if (stdSentenceLength > 4.5 && stdSentenceLength < 5.5) {
            base += (stdSentenceLength - 4.5) * 0.5;
        } else if (stdSentenceLength >= 5.5) {
            base += 0.5;
        }
        
        if (wordTtr > 0.78 && wordTtr < 0.81) {
            base -= (wordTtr - 0.78) * 15;
        } else if (wordTtr < 0.75) {
            base -= (0.75 - wordTtr) * 5;
        }
        expr1Score = Math.max(2.5, Math.min(3.8, base));
        expr1Desc = "전반적으로 무난한 흐름이지만, 글을 더 생동감 있게 만들려면 문장 길이를 다양하게 바꾸고 어색한 단어 연결을 자연스럽게 다듬는 것이 좋습니다.";
    }
    scores['문장 및 어휘의 자연스러움'] = { score: Math.round(expr1Score * 10) / 10, description: expr1Desc };

    // 2) 반론 고려 및 신중한 표현 (Content 5) - 동적 스케일링 적용
    let scalingFactor = 1.0;
    if (wordCount < 500) {
        scalingFactor = 1.0 + (500 - wordCount) / 300.0;
    }
    const optMin = 7.0 / scalingFactor;
    const optMax = 9.0 * scalingFactor;
    const overLimit = 11.0 * scalingFactor;
    const underLimit = 4.0 / scalingFactor;
    
    const refutationWords = ['물론', '반면', '일각에서는', '반대 의견', '혹자는', '비록'];
    const hasRefutation = refutationWords.some(w => cleanText.includes(w));
    
    let content5Score = 3.0;
    let content5Desc = "";
    if (totalHedgeDensity >= optMin && totalHedgeDensity <= optMax && stdSentenceLength >= 5.5) {
        content5Score = hasRefutation ? 5.0 : 4.3;
        content5Desc = "1,000어절당 완화 표현 밀도가 조화로우며 문장 호흡의 다양성(5.5 이상) 또한 함께 살아있어, 자신의 주장을 신중하고 설득력 있게 펼치는 성숙한 논조를 훌륭하게 보여주고 있습니다.";
    } else {
        if (totalHedgeDensity > overLimit) {
            content5Score = 2.5;
            content5Desc = "완화 어구(~로 보인다, ~일 수 있다)가 너무 빈번히 사용되어 주장의 선명도가 다소 낮아지거나 문장이 다소 경직된 인상을 줄 수 있습니다. 자신의 요지를 보다 자신감 있고 명확하게 제기해 보는 연습을 해보세요.";
        } else if (totalHedgeDensity < underLimit) {
            content5Score = 2.0;
            content5Desc = "논증이 다소 단정적으로 흘러 독자의 반론을 수용할 여지가 부족할 수 있습니다. 완화 어구(~로 해석된다, ~할 여지가 크다)를 적절히 활용하여 신중하고 설득력 있는 논조를 보완해 보세요.";
        } else {
            content5Score = hasRefutation ? 3.5 : 3.0;
            content5Desc = "완화 표현의 밀도는 비교적 양호하나, 문장의 흐름을 더 유연하게 다듬고 상대방의 반론도 사려 깊게 포용해 주는 글쓰기 구조를 보완하기를 추천합니다.";
        }
    }
    scores['반론 고려 및 신중한 표현'] = { score: Math.round(content5Score * 10) / 10, description: content5Desc };

    // 3) 문제 상황 제시 및 정보성 (Content 1)
    const introP = paragraphs[0] || "";
    const introKeywords = ['문제', '논란', '현상', '갈등', '최근', '실태', '현실', '상황', '어려움', '부각'];
    const introScoreFactor = introKeywords.filter(kw => introP.includes(kw)).length;
    let content1Score = Math.min(5.0, Math.max(1.5, 2.0 + (introScoreFactor * 0.4) + (introP.length / 200)));
    content1Score = Math.round(content1Score * 10) / 10;
    let content1Desc = "";
    if (content1Score < 2.5) {
        content1Desc = "서론에서 문제제기가 전혀 이루어지지 않았거나 매우 모호합니다. 독자의 이목을 끌 수 있도록 문제 상황과 사회적 배경 정보를 대폭 보강해 주세요.";
    } else if (content1Score < 4.0) {
        content1Desc = "서론의 문제제기가 분량 면에서 다소 짧거나 갈등 양상이 흐릿합니다. 독자가 현안의 중요성을 체감할 수 있도록 구체적인 실태 배경이나 통계를 보완해 보세요.";
    } else {
        content1Desc = "서론에서 당면한 구체적인 문제 상황과 갈등 지점을 밀도 높은 배경 정보와 키워드로 분명하게 제기하여 서두의 정보성이 우수합니다.";
    }
    scores['문제 상황 제시 및 정보성'] = { score: content1Score, description: content1Desc };

    // 4) 주장의 명료성과 일관성 (Content 2)
    const claimKeywords = ['해야 한다', '필요하다', '요구된다', '생각한다', '바람직하다', '타당하다'];
    let claimMatches = 0;
    claimKeywords.forEach(k => {
        const matches = cleanText.match(new RegExp(k, 'g'));
        if (matches) claimMatches += matches.length;
    });
    const outroP = paragraphs[paragraphs.length - 1] || "";
    let commonNounsFactor = 0.0;
    if (outroP) {
        const introWords = new Set(introP.split(/\s+/).map(w => w.replace(/[^\w]/g, '')).filter(Boolean));
        const outroWords = outroP.split(/\s+/).map(w => w.replace(/[^\w]/g, '')).filter(Boolean);
        const overlap = outroWords.filter(w => introWords.has(w));
        if (overlap.length >= 3) {
            commonNounsFactor = 0.5;
        }
    }
    let content2Score = Math.min(5.0, Math.max(1.5, 2.5 + (claimMatches >= 2 ? 0.3 : 0.0) + (commonNounsFactor * 3)));
    content2Score = Math.round(content2Score * 10) / 10;
    let content2Desc = "";
    if (content2Score < 2.5) {
        content2Desc = "주제가 명확하지 않거나 무엇을 주장하는지 파악하기 어렵습니다. 주장하는 요지를 선명한 한 문장의 완성된 형태로 명시하여 글의 뼈대를 다시 세워보세요.";
    } else if (content2Score < 4.0) {
        content2Desc = "글의 서론-본론-결론이 흐트러짐 없이 하나의 논지로 수렴하는지 일관성을 점검해야 합니다. 중심 생각을 한 문장으로 다듬어 글 전반에 일관되게 녹여보세요.";
    } else {
        content2Desc = "핵심적인 주장이 명시적인 문장 형태로 서술되어 있고, 서론에서 제기한 질문과 결론의 해답이 일관된 논지로 유기적으로 잘 대응합니다.";
    }
    scores['주장의 명료성과 일관성'] = { score: content2Score, description: content2Desc };

    // 5) 논거의 설득력과 적절성 (Content 3)
    const reasonKeywords = ['왜냐하면', '기 때문이다', '이유는', '근거로', '때문이다'];
    const citationKeywords = ['연구', '통계', '조사', '분석', '자료', '뉴스', '보고서', '수치'];
    let reasonMatches = 0;
    reasonKeywords.forEach(k => {
        const matches = cleanText.match(new RegExp(k, 'g'));
        if (matches) reasonMatches += matches.length;
    });
    let citationMatches = 0;
    citationKeywords.forEach(k => {
        const matches = cleanText.match(new RegExp(k, 'g'));
        if (matches) citationMatches += matches.length;
    });
    let content3Score = Math.min(5.0, Math.max(1.5, 2.0 + (reasonMatches * 0.4) + (citationMatches * 0.3)));
    content3Score = Math.round(content3Score * 10) / 10;
    let content3Desc = "";
    if (content3Score < 2.5) {
        content3Desc = "주장에 대한 객관적 증명이 결여되어 주관적인 독백에 그치고 있습니다. 신뢰할 수 있는 외부 통계 자료나 연구 성과 등의 객관적 논거를 필수적으로 보강해야 합니다.";
    } else if (content3Score < 4.0) {
        content3Desc = "단순히 글쓴이의 주관적 견해만 반복되는 경향이 있습니다. 실제 사례나 통계 지표 등 객관적인 외부 논거를 추가하여 주장의 신뢰도를 높여보세요.";
    } else {
        content3Desc = "주장을 뒷받침할 수 있는 합리적인 사실적 논거와 객관적인 신뢰성 높은 인용(조사 연구, 통계 자료 등)이 적절히 잘 구성되어 있습니다.";
    }
    scores['논거의 설득력과 적절성'] = { score: content3Score, description: content3Desc };

    // 6) 논리 전개의 충분성 (Content 4)
    const bodyParagraphs = paragraphCount > 2 ? paragraphs.slice(1, -1) : paragraphs.slice(1);
    const longBodyCount = bodyParagraphs.filter(p => p.length >= 250).length;
    let content4Score = Math.min(5.0, Math.max(1.0, 1.5 + (longBodyCount * 1.0) + (bodyParagraphs.length * 0.3)));
    content4Score = Math.round(content4Score * 10) / 10;
    let content4Desc = "";
    if (content4Score < 2.5) {
        content4Desc = "본론의 서술이 매우 거칠고 생략이 심해 논리적 흐름이 끊깁니다. 하위 문단마다 구체적인 설명과 풍부한 세부 내용을 덧붙여 논리적 비약을 메워주어야 합니다.";
    } else if (content4Score < 4.0) {
        content4Desc = "소주제를 뒷받침하는 설명이 부족하거나, 본론의 이야기가 갑자기 건너뛰듯 서술되었습니다. 세부 내용을 더 구체적으로 덧붙여 글의 깊이와 분량을 채워보세요.";
    } else {
        content4Desc = "본론 문단이 구체적인 하위 주장들로 짜임새 있게 구성되어 논리적 전개의 충분성과 분석적 깊이가 우수합니다.";
    }
    scores['논리 전개의 충분성'] = { score: content4Score, description: content4Desc };

    // 7) 글의 유기적 구조(서론·본론·결론) (Organization 1)
    const transKeywords = ['우선', '첫째', '다음으로', '나아가', '더불어', '하지만', '그러나', '반면', '따라서', '결과적으로', '결론적으로'];
    const transMatches = transKeywords.filter(k => cleanText.includes(k)).length;
    let org1Score = 3.0;
    if (paragraphCount === 4 || paragraphCount === 5) {
        org1Score += 1.0;
    } else if (paragraphCount < 3) {
        org1Score -= 1.5;
    }
    org1Score += Math.min(1.0, transMatches * 0.15);
    org1Score = Math.min(5.0, Math.max(1.0, org1Score));
    org1Score = Math.round(org1Score * 10) / 10;
    let org1Desc = "";
    if (org1Score < 2.5) {
        org1Desc = "문단 구분이 전혀 없거나 서론-본론-결론의 삼단 구성이 해체되어 있어 가독성이 매우 떨어집니다. 서론, 본론, 결론의 경계를 명확히 나누고 문맥 흐름을 처음부터 다시 가다듬어야 합니다.";
    } else if (org1Score < 4.0) {
        org1Desc = "문단 구분이 모호하거나 하나의 호흡에 여러 중심 생각이 뭉쳐 있습니다. 서론(1)-본론(2~3)-결론(1)의 구조로 분절하고 유기적인 연결어를 활용해 매끄럽게 다듬어 보세요.";
    } else {
        org1Desc = "서론-본론-결론의 유기적인 논리적 삼단 구성이 구조적으로 체체적이며, 문단 전환 연결어들이 흐름을 매끄럽게 유도해 줍니다.";
    }
    scores['글의 유기적 구조(서론·본론·결론)'] = { score: org1Score, description: org1Desc };

    // 8) 문단의 완결성과 통일성 (Organization 2)
    const pLengths = paragraphs.map(p => p.length);
    const pAvgLen = pLengths.reduce((a, b) => a + b, 0) / (pLengths.length || 1);
    const pVar = pLengths.reduce((a, b) => a + Math.pow(b - pAvgLen, 2), 0) / (pLengths.length || 1);
    const pLengthStd = Math.sqrt(pVar);
    const sentencesPerP = sentenceCount / (paragraphCount || 1);
    let org2Score = 3.0;
    if (sentencesPerP >= 4.0 && sentencesPerP <= 7.0) {
        org2Score += 1.0;
    }
    if (pLengthStd < 150) {
        org2Score += 1.0;
    } else if (pLengthStd > 350) {
        org2Score -= 1.0;
    }
    org2Score = Math.min(5.0, Math.max(1.0, org2Score));
    org2Score = Math.round(org2Score * 10) / 10;
    let org2Desc = "";
    if (org2Score < 2.5) {
        org2Desc = "특정 문단의 분량이 기형적으로 비대하거나 1문장짜리 극단적 문단이 방치되어 균형이 무너졌습니다. 각 문단이 하나의 완성된 소주제를 다루도록 내용 분량을 대대적으로 재배분해야 합니다.";
    } else if (org2Score < 4.0) {
        org2Desc = "어떤 문단은 방대한 반면, 다른 문단은 단 1~2문장에 그치고 있습니다. 각 문단이 일관된 개념 단위를 이루도록 문단 간 분량 균형을 조정하는 것을 권장합니다.";
    } else {
        org2Desc = "각 문단이 소주제문을 중심으로 균형 있게 서술되었으며, 문단 간 길이 비율이 시각적으로도 조화롭게 유지됩니다.";
    }
    scores['문단의 완결성과 통일성'] = { score: org2Score, description: org2Desc };

    // 9) 어문 규범 및 장르 관습 준수 (Expression 2)
    let badEndings = 0;
    const badRegexes = [/\b(요|죠)\b[.!?]/g, /\b(했음|했슴|음)\b[.!?]/g];
    badRegexes.forEach(r => {
        const matches = cleanText.match(r);
        if (matches) badEndings += matches.length;
    });
    let goodEndings = 0;
    const goodRegexes = [/\b(다|것이다|한다|하였다|않는다|있다)\b[.!?]/g];
    goodRegexes.forEach(r => {
        const matches = cleanText.match(r);
        if (matches) goodEndings += matches.length;
    });
    const totalEndpoints = badEndings + goodEndings;
    const ratio = totalEndpoints > 0 ? goodEndings / totalEndpoints : 1.0;
    
    let expr2Score = 4.8;
    if (ratio < 0.9) {
        expr2Score -= (1.0 - ratio) * 5;
    }
    if (highlights.length > 10) {
        expr2Score -= 1.0;
    }
    expr2Score = Math.min(5.0, Math.max(1.0, expr2Score));
    expr2Score = Math.round(expr2Score * 10) / 10;
    let expr2Desc = "";
    if (expr2Score < 2.5) {
        expr2Desc = "공적인 글에 어울리지 않는 약식 종결(~음, ~함) 및 일상 구어체 표현이 빈번하게 식별되어 격식성이 크게 저하되었습니다. 전체 문장을 완전한 문어체 어미(~다.)로 철저히 교정해 주세요.";
    } else if (expr2Score < 4.0) {
        expr2Desc = "대화형 구어체 어미(~요, ~죠)나 공적인 글에 적절치 않은 명사형 축약 종결(~음, ~함)이 일부 식별되었습니다. 학술용 완전한 문장 어미(~다.)로 통일해 보세요.";
    } else {
        expr2Desc = "논증문의 격식 있는 표준적인 문어체 종결어미(~다.)와 문장 부호를 일관되게 적용하여 글의 장르적 신뢰성을 잘 갖추고 있습니다.";
    }
    scores['어문 규범 및 장르 관습 준수'] = { score: expr2Score, description: expr2Desc };

    // 종합점수 및 평균 계산
    let totalSum = 0;
    for (let key in scores) {
        totalSum += scores[key].score;
    }
    const totalAverage = Math.round((totalSum / Object.keys(scores).length) * 100) / 100;

    // 종합 평균 B- 이하(3.5 미만) 백엔드 톤다운 필터링 모방
    if (totalAverage < 3.5) {
        for (let key in scores) {
            if (scores[key].score >= 4.0) {
                if (key === '문장 및 어휘의 자연스러움') {
                    scores[key].description = "문장 길이의 편차가 비교적 단조롭지 않은 흐름을 유지하여 기본적인 요건은 충족하고 있으나, 글 전반의 구조적 논증성과 흐름을 보완하기 위해 세부 단어 배치와 표현을 좀 더 다듬는 노력이 수반되어야 합니다.";
                } else if (key === '반론 고려 및 신중한 표현') {
                    scores[key].description = "완화 어구의 활용 빈도는 적절하여 지나친 단정을 일부 피하고 있으나, 글 전반의 학술적 깊이와 논증력을 확보하기 위해 본론의 구체적 근거와 연계하여 주장의 신뢰도를 다각도로 보강하시기 바랍니다.";
                } else if (key === '문제 상황 제시 및 정보성') {
                    scores[key].description = "서론에서 기본적인 문제의식을 서술하고 있으나, 독자에게 다가가는 객관적 설득력을 한층 더 높이기 위해 문제와 연계된 통계적 실태나 구체적 사회 배경 정보를 더욱 밀도 있게 보강하는 것이 좋습니다.";
                } else if (key === '주장의 명료성과 일관성') {
                    scores[key].description = "중심 주장의 외형적 형태는 갖추어 제기되었으나, 서론에서 던진 질문과 본론의 인과 관계 및 결론의 요약이 일관되게 수렴하고 호응하는지 전체적인 흐름의 논지를 재점검할 필요가 있습니다.";
                } else if (key === '논거의 설득력과 적절성') {
                    scores[key].description = "주장을 이끌어내는 추론의 방향은 타당하나, 학술문으로서의 신뢰성과 완성도를 위해 이를 명확히 지탱해 줄 전문 연구 조사나 객관적인 통계 데이터를 촘촘하게 인용해 보강해야 합니다.";
                } else if (key === '논리 전개의 충분성') {
                    scores[key].description = "본론의 내용 분량은 비교적 채워졌으나, 각 문단 내 하위 논증들이 비약이나 생략 없이 촘촘하게 전개되었는지 문장 간 인과 관계의 충실도를 좀 더 차분하게 다듬을 필요가 있습니다.";
                } else if (key === '글의 유기적 구조(서론·본론·결론)') {
                    scores[key].description = "기본적인 삼단 구성의 골격은 성립하고 있으나, 서론에서 본론, 결론으로 전개되는 문단 간의 유기적 매끄러움을 위해 적절한 접속 어휘를 적용하여 논리적 연결 고리를 단정하게 가가듬어야 합니다.";
                } else if (key === '문단의 완결성과 통일성') {
                    scores[key].description = "문단별 길이 비율과 소주제 배치는 양호한 흐름을 유지하고 있으나, 각 문단이 하나의 일관된 개념 단위를 긴밀하게 이루도록 세부 설명의 통일성을 조율하는 것을 권장합니다.";
                } else if (key === '어문 규범 및 장르 관습 준수') {
                    scores[key].description = "문어체 종결어미와 부호 등의 격식은 비교적 안정적으로 지켜지고 있으나, 공적인 논증문의 정체성을 확고히 지키기 위해 사소하게 발견되는 비격식 구어 표현 및 어법의 불일치를 철저히 정돈해야 합니다.";
                }
            }
        }
    }

    // 등급 산정
    let grade = "C-";
    if (totalAverage >= 4.5) grade = "A+";
    else if (totalAverage >= 4.0) grade = "A-";
    else if (totalAverage >= 3.5) grade = "B+";
    else if (totalAverage >= 3.0) grade = "B-";
    else if (totalAverage >= 2.5) grade = "C+";

    // 3대 영역 평균
    const appCon = (scores['문제 상황 제시 및 정보성'].score +
                    scores['주장의 명료성과 일관성'].score +
                    scores['논거의 설득력과 적절성'].score +
                    scores['논리 전개의 충분성'].score +
                    scores['반론 고려 및 신중한 표현'].score) / 5.0;
    
    const appOrg = (scores['글의 유기적 구조(서론·본론·결론)'].score +
                    scores['문단의 완결성과 통일성'].score) / 2.0;
    
    const appExp = (scores['문장 및 어휘의 자연스러움'].score +
                    scores['어문 규범 및 장르 관습 준수'].score) / 2.0;

    // 강점/취약 영역 한줄평 생성
    const maxScore = Math.max(appCon, appOrg, appExp);
    const strongCandidates = [];
    if (appCon >= 4.0 || appCon === maxScore) strongCandidates.push({ name: "내용", score: appCon });
    if (appOrg >= 4.0 || appOrg === maxScore) strongCandidates.push({ name: "조직", score: appOrg });
    if (appExp >= 4.0 || appExp === maxScore) strongCandidates.push({ name: "표현", score: appExp });
    strongCandidates.sort((a, b) => b.score - a.score);
    const strongDomain = strongCandidates[0].name;
    const strongScore = Math.round(strongCandidates[0].score * 10) / 10;
    
    let weakDomain = "조직";
    let weakScore = Math.round(appOrg * 10) / 10;
    if (appCon < appOrg) {
        weakDomain = "내용";
        weakScore = Math.round(appCon * 10) / 10;
    }
    
    if (totalAverage < 2.5) {
        if (strongDomain === "내용") {
            weakDomain = "조직";
            weakScore = Math.round(appOrg * 10) / 10;
        } else {
            weakDomain = "내용";
            weakScore = Math.round(appCon * 10) / 10;
        }
    }
    
    const strongMessages = {
        "내용": `내용 영역(주제 의식 및 신중한 완화 표현)에서 깊이 있는 논리 전개(평균 ${strongScore}점)가 돋보이나,`,
        "조직": `조직 영역(삼단 구성 및 문단 완결성)에서 체계적이고 안정적인 짜임새(평균 ${strongScore}점)가 돋보이나,`,
        "표현": `표현 영역(다채로운 문장 호흡 및 어문 규범)에서 자연스럽고 생동감 있는 문맥 흐름(평균 ${strongScore}점)이 우수하나,`
    };
    
    const weakMessages = {
        "내용": `상대적으로 보완이 필요한 내용 영역(평균 ${weakScore}점)의 구체적인 통계/실태 배경 정보를 보강하고 주장을 신중하게 완화한다면 더욱 설득력 높은 명문이 될 수 있습니다.`,
        "조직": `글의 전반적인 짜임새를 높이기 위해 조직 영역(평균 ${weakScore}점)의 서론-본론-결론 간 유기적인 흐름과 문단별 내용 균형을 보완해 보기를 권장합니다.`
    };
    
    const gradeCommentary = `${strongMessages[strongDomain]} ${weakMessages[weakDomain]}`;

    // AI 문체 경고 가이드라인 계산
    const aiSentenceWarning = stdSentenceLength < 5.0;
    const aiSentenceFeedback = aiSentenceWarning ? "현재 문장들의 길이와 구조가 다소 일정하여, 독자에게 기계적인 인상을 줄 수 있습니다. 생각의 흐름에 맞춰 짧은 문장과 긴 문장을 다채롭게 섞어 쓰면 글의 활력이 살아납니다." : "";
    const aiWordWarning = wordTtr >= 0.81;
    const aiWordFeedback = aiWordWarning ? "단어들이 다채롭게 사용되었으나 사전식 나열에 가깝습니다. 핵심 주제 키워드를 자연스럽게 맥락 속에서 반복하며 일관된 방향으로 전개해 보세요." : "";

    return {
        std_sentence_length: Math.round(stdSentenceLength * 100) / 100,
        word_ttr: Math.round(wordTtr * 1000) / 1000,
        morpheme_ttr: Math.round(morphemeTtr * 1000) / 1000,
        total_hedge_density: Math.round(totalHedgeDensity * 100) / 100,
        ai_sentence_warning: aiSentenceWarning,
        ai_sentence_feedback: aiSentenceFeedback,
        ai_word_warning: aiWordWarning,
        ai_word_feedback: aiWordFeedback,
        scores: scores,
        total_average: totalAverage,
        grade: grade,
        grade_commentary: gradeCommentary,
        highlights: highlights,
        char_count: charCount,
        word_count: wordCount,
        sentence_count: sentenceCount,
        paragraph_count: paragraphCount,
        using_konlpy: false
    };
}
