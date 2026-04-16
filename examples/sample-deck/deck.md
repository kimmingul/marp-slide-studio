---
marp: true
theme: obsidian-mono
paginate: true
size: 16:9
---

<!-- _class: hero -->
<!-- _paginate: false -->

<div class="overline">01 · Opening</div>

# 한글 슬라이드의<br>문제는 폰트가 아니라<br>호흡이다.

<div class="support">2026년 4월, 내부 타이포그래피 리뷰</div>

---

<!-- _class: monumental -->
<!-- _paginate: false -->

# "왜 대부분의 한글 슬라이드는<br>답답해 보이는가?"

---

<!-- _class: split split-60-40 -->

<div class="col-main">

## 실패한 가설 1

**폰트가 문제다.** 맑은 고딕이 촌스럽다, Apple SD Gothic이 답답하다는 의견. 하지만 같은 폰트로 잘 만든 슬라이드도 많다. 폰트는 범인이 아니다.

</div>

<div class="col-aside">

![same font good vs bad](placeholder-1.svg)

</div>

---

<!-- _class: split split-55-45 -->

<div class="col-main">

## 실패한 가설 2

**크기가 문제다.** 본문 24px는 작다는 의견. 그러나 24px도 line-height가 적절하면 잘 읽힌다. 크기 역시 범인이 아니다.

</div>

<div class="col-aside">

![size comparison same lh different](placeholder-2.svg)

</div>

---

<!-- _class: split split-60-40 -->

<div class="col-main">

## 실패한 가설 3

**컬러가 문제다.** 검정/흰색 조합이 차갑다는 의견. 그러나 Apple Keynote 데모 슬라이드는 대부분 저 조합이다. 컬러도 아니다.

</div>

<div class="col-aside">

![apple keynote screenshot](placeholder-3.svg)

</div>

---

<!-- _class: divider -->

<div class="divider-number">02</div>
<div class="divider-title">진짜 원인</div>
<div class="divider-subtitle">가설들이 다 틀렸다면, 남은 것은 하나뿐이다</div>

---

<!-- _class: metric -->

<div class="metric-label">본문 line-height 기본값</div>

<div class="metric-value">1.5<span class="unit"> → 1.7</span></div>

<div class="metric-caption">영문에서 **1.5**는 충분하지만, 한글 음절 블록은 수직으로 더 촘촘해 같은 값에서 문단이 벽처럼 느껴진다. **한글 본문의 기본값은 1.7이어야 한다.**</div>

---

<!-- _class: enumerated -->

## 세 가지 규칙

<ol class="enum">
  <li>
    <span class="num">01</span>
    <h3>본문 line-height 1.7</h3>
    <p>헤드라인은 1.15. 디스플레이는 0.95. 한글은 여백으로 호흡한다.</p>
  </li>
  <li>
    <span class="num">02</span>
    <h3>자간 −0.02em (헤드라인)</h3>
    <p>디지털 한글 폰트는 큰 크기에서 자간이 헐겁다. 헤드라인부터 살짝 조인다.</p>
  </li>
  <li>
    <span class="num">03</span>
    <h3>본문 22px 이하 금지</h3>
    <p>1920 슬라이드에서 이보다 작으면 프로젝터 뒤쪽에서 읽히지 않는다.</p>
  </li>
</ol>

---

<!-- _class: split split-40-60 -->

<div class="col-main">

## Pretendard Variable 하나로 95%

한글과 영문을 같은 굵기로 렌더링하는 유일한 무료 가변 폰트. CDN 한 줄로 끝난다.

</div>

<div class="col-aside">

```css
@import url('https://cdn.jsdelivr.net/gh/
  orioncactus/pretendard@v1.3.9/
  dist/web/variable/
  pretendardvariable.min.css');

:root {
  --font-body: 'Pretendard Variable',
               sans-serif;
  --lh-body: 1.7;
}
```

</div>

---

<!-- _class: monumental -->
<!-- _paginate: false -->

# "한글 슬라이드의<br>문제는 폰트가 아니라<br>호흡이다."
